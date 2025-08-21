import { HttpStatus, Injectable } from '@nestjs/common';
import { QueryRunnerService } from '@app/database/services/query-runner.service';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { FilialsProductsRepository } from '../../filials/repositories/filials-products.repository';
import { StockInCommand } from '../dto/command/stock-in.command';
import { ProductStatus } from '../enums/product-status.enum';
import { StockMovemantsFromEnum } from '../enums/stock-movemants.enum';
import { ProductRepository } from '../repositories/product.repository';
import { StockMovementRepository } from '../repositories/stock-movement.repository';

@Injectable()
export class StockMovementService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly sMovementRepository: StockMovementRepository,
    private readonly queryRunnerService: QueryRunnerService,
    private readonly filialProductsRepository: FilialsProductsRepository,
  ) {}

  async stockIn(productId: string, command: StockInCommand): Promise<boolean> {
    const product = await this.productRepository.findOne(productId);

    product.count += command.quantity;
    const status =
      product.count > product.minStock
        ? ProductStatus.IN_STOCK
        : ProductStatus.LOW_STOCK;

    product.status = status;

    const partyType: string =
      command.party === StockMovemantsFromEnum.SUPPLIER
        ? product.supplier
        : command.partyType;

    const queryRunner = await this.queryRunnerService.create();

    try {
      await this.productRepository.update(productId, product, queryRunner);

      if (command.party === StockMovemantsFromEnum.OTHER_FILIAL) {
        await this.filialProductsRepository.update(
          command.partyType as string,
          productId,
          command.quantity,
          'out',
          queryRunner,
        );

        await this.filialProductsRepository.update(
          command.filial,
          productId,
          command.quantity,
          'in',
          queryRunner,
        );
      } else if (
        command.party === StockMovemantsFromEnum.SUPPLIER ||
        // TODO: Doing returnin client
        command.party === StockMovemantsFromEnum.RETURN_FROM_CUSTOMER
      ) {
        await this.filialProductsRepository.update(
          command.filial,
          productId,
          command.quantity,
          'in',
          queryRunner,
        );
      }

      await this.sMovementRepository.stockIn(
        productId,
        // TODO: Change partyType type (! or ?) beacuose when party is Supplier, partyType = product supplier and it save avtomaticly
        { ...command, partyType: partyType },
        queryRunner,
      );

      await this.queryRunnerService.finish(queryRunner);

      return true;
    } catch (error: any) {
      await this.queryRunnerService.rollback(queryRunner);

      return false;
    }
  }

  async stockOut(productId: string, command: StockInCommand): Promise<boolean> {
    const product = await this.productRepository.findOne(productId);

    if (product.count < command.quantity) {
      throw new AppHttpException(
        ExceptionMessage.PRODUCT_NOT_ENOUGHT,
        HttpStatus.BAD_REQUEST,
        ExceptionLocalCode.PRODUCT_NOT_ENOUGHT,
      );
    }

    product.count -= command.quantity;
    const status =
      product.count > product.minStock
        ? ProductStatus.IN_STOCK
        : product.count === 0
          ? ProductStatus.OUT_OF_STOCK
          : ProductStatus.LOW_STOCK;

    product.status = status;

    const queryRunner = await this.queryRunnerService.create();

    try {
      await this.productRepository.update(productId, product, queryRunner);

      await this.sMovementRepository.stockOut(productId, command, queryRunner);

      await this.queryRunnerService.finish(queryRunner);

      return true;
    } catch (err: any) {
      await this.queryRunnerService.rollback(queryRunner);

      return false;
    }
  }
}
