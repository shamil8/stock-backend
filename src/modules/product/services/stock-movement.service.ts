import { HttpStatus, Injectable } from '@nestjs/common';
import { QueryRunnerService } from '@app/database/services/query-runner.service';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { ClientsRepository } from '../../clients/repositories/clients.repository';
import { FilialRepository } from '../../filials/repositories/filial.repository';
import { FilialsProductsRepository } from '../../filials/repositories/filials-products.repository';
import { StockInCommand } from '../dto/command/stock-in.command';
import { StockMovementResource } from '../dto/resources/movement.stock.resource';
import {
  ProductHistoryAction,
  ProductHistoryType,
} from '../enums/product-history.enum';
import { ProductStatus } from '../enums/product-status.enum';
import { StockMovemantsFromEnum } from '../enums/stock-movemants.enum';
import { HistoryRepository } from '../repositories/history.repository';
import { ProductRepository } from '../repositories/product.repository';
import { StockMovementRepository } from '../repositories/stock-movement.repository';

@Injectable()
export class StockMovementService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly sMovementRepository: StockMovementRepository,
    private readonly queryRunnerService: QueryRunnerService,
    private readonly filialProductsRepository: FilialsProductsRepository,
    private readonly clientRepository: ClientsRepository,
    private readonly producHistoryRepository: HistoryRepository,
    private readonly filialsRepository: FilialRepository,
  ) {}

  async stockIn(
    userId: string,
    productId: string,
    command: StockInCommand,
  ): Promise<boolean> {
    const product = await this.productRepository.findById(productId);
    const filial = await this.filialsRepository.getBiIdOrThrow(
      command.filialId,
    );

    const previousQuantity = product.count;

    product.count += command.quantity;
    const status =
      product.count > product.minStock
        ? ProductStatus.IN_STOCK
        : ProductStatus.LOW_STOCK;

    product.status = status;

    let partyType: string = command.partyType ?? '';

    if (
      !command.partyType ||
      command.party === StockMovemantsFromEnum.SUPPLIER
    ) {
      partyType = product.supplier;
    } else if (command.party === StockMovemantsFromEnum.RETURN_FROM_CUSTOMER) {
      await this.clientRepository.findClientByIdOrThrow(command.partyType);
      partyType = command.partyType;
    }

    const movementCommand = {
      productId,
      userId: userId,
      filialId: command.filialId,
      quantity: command.quantity,
      previousQuantity,
      newQuantity: product.count,
      reason: command.reason,
      party: command.party,
      partyType: partyType,
      reference: `${command.party.toUpperCase()}-${Date.now()}`,
      notes: command.notes,
    };

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
          command.filialId,
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
          command.filialId,
          productId,
          command.quantity,
          'in',
          queryRunner,
        );
      }

      await this.sMovementRepository.stockIn(
        productId,
        // TODO: Change partyType type (! or ?) beacuose when party is Supplier, partyType = product supplier and it save avtomaticly
        movementCommand,
        queryRunner,
      );

      // TODO: Make and command for history because of userId
      await this.producHistoryRepository.create(userId, {
        action: ProductHistoryAction.STOCK_IN,
        entityType: ProductHistoryType.STOCK,
        description: `Added 20 units ${product.name} to ${filial.name}`,
        userId: userId,
        productId,
        details: { filialName: filial.name, supplie: product.supplier },
      }),
        queryRunner;

      await this.queryRunnerService.finish(queryRunner);

      return true;
    } catch (error: any) {
      await this.queryRunnerService.rollback(queryRunner);

      return false;
    }
  }

  async stockOut(
    userId: string,
    productId: string,
    command: StockInCommand,
  ): Promise<boolean> {
    const product = await this.productRepository.findById(productId);
    const filial = await this.filialsRepository.getBiIdOrThrow(
      command.filialId,
    );

    if (product.count < command.quantity) {
      throw new AppHttpException(
        ExceptionMessage.PRODUCT_NOT_ENOUGHT,
        HttpStatus.BAD_REQUEST,
        ExceptionLocalCode.PRODUCT_NOT_ENOUGHT,
      );
    }

    const previousQuantity = product.count;

    product.count -= command.quantity;
    const status =
      product.count > product.minStock
        ? ProductStatus.IN_STOCK
        : product.count === 0
          ? ProductStatus.OUT_OF_STOCK
          : ProductStatus.LOW_STOCK;

    product.status = status;

    const movementCommand = {
      productId,
      userId: userId,
      filialId: command.filialId,
      quantity: command.quantity,
      previousQuantity,
      newQuantity: product.count,
      reason: command.reason,
      party: command.party,
      partyType: command.partyType,
      reference: `${command.party.toUpperCase()}-${Date.now()}`,
      notes: command.notes,
    };

    const queryRunner = await this.queryRunnerService.create();

    try {
      await this.productRepository.update(productId, product, queryRunner);

      await this.sMovementRepository.stockOut(
        productId,
        movementCommand,
        queryRunner,
      );

      await this.queryRunnerService.finish(queryRunner);

      await this.producHistoryRepository.create(userId, {
        action: ProductHistoryAction.STOCK_IN,
        entityType: ProductHistoryType.STOCK,
        description: `Removed 20 units ${product.name} - ${command.reason}`,
        userId: userId,
        productId,
        details: { filialName: filial.name, supplie: product.supplier },
      });

      return true;
    } catch (err: any) {
      await this.queryRunnerService.rollback(queryRunner);

      return false;
    }
  }

  getAll(): Promise<StockMovementResource[]> {
    return this.sMovementRepository.getAll();
  }
}
