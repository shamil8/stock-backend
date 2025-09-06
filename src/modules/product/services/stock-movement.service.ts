import { Injectable } from '@nestjs/common';
import { QueryRunnerService } from '@app/database/services/query-runner.service';

import { ClientsRepository } from '../../clients/repositories/clients.repository';
import { FilialRepository } from '../../filials/repositories/filial.repository';
import { FilialsProductsRepository } from '../../filials/repositories/filials-products.repository';
import { UserService } from '../../users/services/user.service';
import { StockInCommand } from '../dto/command/stock-in.command';
import { StockMovementResource } from '../dto/resources/movement.stock.resource';
import {
  ProductHistoryAction,
  ProductHistoryType,
} from '../enums/product-history.enum';
import { ProductStatus } from '../enums/product-status.enum';
import { StockMovemants } from '../enums/stock-movemants.enum';
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
    private readonly userServise: UserService,
  ) {}

  async stockIn(
    userId: string,
    productId: string,
    command: StockInCommand,
  ): Promise<StockMovementResource | boolean> {
    const product = await this.productRepository.findById(productId);
    const filial = await this.filialsRepository.getBiIdOrThrow(
      command.filialId,
    );
    const user = await this.userServise.findUserById(userId);

    const productCount = await this.filialProductsRepository.getProductCount(
      command.filialId,
      productId,
    );

    const previousQuantity = productCount;

    product.count += command.quantity;
    const status =
      product.count > product.minStock
        ? ProductStatus.IN_STOCK
        : ProductStatus.LOW_STOCK;

    product.status = status;

    const movementCommand = {
      productId,
      userId: userId,
      filialId: command.filialId,
      quantity: command.quantity,
      previousQuantity,
      newQuantity: productCount + command.quantity,
      reason: command.reason,
      party: command.party,
      partyType: command.partyType,
      reference: `${command.party.toUpperCase()}-${Date.now()}`,
      notes: command.notes,
    };

    const queryRunner = await this.queryRunnerService.create();

    try {
      if (command.party === StockMovemants.OTHER_FILIAL) {
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
        command.party === StockMovemants.SUPPLIER ||
        // TODO: Doing returnin client
        command.party === StockMovemants.RETURN_FROM_CUSTOMER
      ) {
        await this.filialProductsRepository.update(
          command.filialId,
          productId,
          command.quantity,
          'in',
          queryRunner,
        );

        await this.productRepository.update(productId, product, queryRunner);
      }

      const stockIn = await this.sMovementRepository.stockIn(
        productId,
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

      const inserted = stockIn.raw[0];

      return new StockMovementResource({
        id: inserted.id,
        productId: productId,
        productName: product.name,
        type: 'stock_in',
        quantity: command.quantity,
        reason: command.reason,
        notes: command.notes,
        performedBy: `${user.firstName} ${user.lastName}`,
        previousQuantity,
        date: inserted.created_at,
        newQuantity: productCount + command.quantity,
        storeId: command.filialId,
        storeName: filial.name,
        party: command.party,
        partyType: command.partyType,
        reference: inserted.reference,
      });
    } catch (error: any) {
      await this.queryRunnerService.rollback(queryRunner);

      return error;
    }
  }

  async stockOut(
    userId: string,
    productId: string,
    command: StockInCommand,
  ): Promise<StockMovementResource | boolean> {
    const product = await this.productRepository.findById(productId);
    const filial = await this.filialsRepository.getBiIdOrThrow(
      command.filialId,
    );
    const user = await this.userServise.findUserById(userId);

    const productCount = await this.filialProductsRepository.getProductCount(
      command.filialId,
      productId,
    );

    const previousQuantity = productCount;

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
      newQuantity: productCount - command.quantity,
      reason: command.reason,
      party: command.party,
      partyType: command.partyType,
      reference: `${command.party.toUpperCase()}-${Date.now()}`,
      notes: command.notes,
    };

    const queryRunner = await this.queryRunnerService.create();

    try {
      if (command.party === StockMovemants.OTHER_FILIAL) {
        await this.filialProductsRepository.update(
          command.partyType as string,
          productId,
          command.quantity,
          'in',
          queryRunner,
        );

        await this.filialProductsRepository.update(
          command.filialId,
          productId,
          command.quantity,
          'out',
          queryRunner,
        );
      } else if (
        command.party === StockMovemants.CLIENT ||
        command.party === StockMovemants.DISCARDED
      ) {
        await this.filialProductsRepository.update(
          command.filialId,
          productId,
          command.quantity,
          'out',
          queryRunner,
        );
        await this.productRepository.update(productId, product, queryRunner);
      }

      const stockOut = await this.sMovementRepository.stockOut(
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
        details: { filialName: filial.name, supplier: product.supplier },
      });

      const inserted = stockOut.raw[0];

      return new StockMovementResource({
        id: inserted.id,
        productId: productId,
        productName: product.name,
        type: 'stock_in',
        quantity: command.quantity,
        reason: command.reason,
        notes: command.notes,
        performedBy: `${user.firstName} ${user.lastName}`,
        previousQuantity,
        date: inserted.created_at,
        newQuantity: productCount - command.quantity,
        storeId: command.filialId,
        storeName: filial.name,
        party: command.party,
        partyType: command.partyType,
        reference: inserted.reference,
      });
    } catch (err: any) {
      await this.queryRunnerService.rollback(queryRunner);

      return err;
    }
  }

  getAll(): Promise<StockMovementResource[]> {
    return this.sMovementRepository.getAll();
  }
}
