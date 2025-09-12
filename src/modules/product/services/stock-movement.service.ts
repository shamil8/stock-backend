import { Injectable } from '@nestjs/common';
import { QueryRunnerService } from '@app/database/services/query-runner.service';

import { ClientsRepository } from '../../clients/repositories/clients.repository';
import { FilialRepository } from '../../filials/repositories/filial.repository';
import { FilialsProductsRepository } from '../../filials/repositories/filials-products.repository';
import { PaymentMethod } from '../../finance/enums/payment-method.enum';
import { TransactionService } from '../../finance/services/transaction.service';
import { UserService } from '../../users/services/user.service';
import { StockInCommand } from '../dto/command/stock-in.command';
import { StockMovementResource } from '../dto/resources/movement.stock.resource';
import {
  ProductHistoryAction,
  ProductHistoryType,
} from '../enums/product-history.enum';
import { ProductStatus } from '../enums/product-status.enum';
import {
  StockMovemants,
  StockMovementsReason,
} from '../enums/stock-movemants.enum';
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
    private readonly productHistoryRepository: HistoryRepository,
    private readonly filialRepository: FilialRepository,
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) {}

  async stockIn(
    userId: string,
    productId: string,
    command: StockInCommand,
  ): Promise<StockMovementResource | boolean> {
    const product = await this.productRepository.findByIdOrThrow(productId);
    const filial = await this.filialRepository.getBiIdOrThrow(command.filialId);
    const user = await this.userService.findUserById(userId);

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

    const transactionCommand = {
      type: await this.transactionService.determineTransactionType(
        command.party,
      ),
      category: await this.transactionService.determineCategory(command.party),
      description: await this.transactionService.generateDescription(
        command.party,
        command.partyType,
      ),
      amount: product.sellingPrice * command.quantity,
      paymentMethod: PaymentMethod.CASH,
      profit: (product.sellingPrice - product.costPrice) * command.quantity,
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
      } else {
        if (command.party === StockMovemants.RETURN_FROM_CUSTOMER) {
          await this.clientRepository.updatePurchase(
            command.partyType,
            'out',
            product.sellingPrice * command.quantity,
            queryRunner,
          );
        }

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
      await this.productHistoryRepository.create(userId, {
        action:
          command.reason === StockMovementsReason.TRANSFER
            ? ProductHistoryAction.TRANSFER
            : ProductHistoryAction.STOCK_IN,
        entityType: ProductHistoryType.STOCK,
        description: `Added ${command.quantity} units ${product.name} to ${filial.name}`,
        userId: userId,
        productId,
        details: {
          filialId: command.filialId,
          quantity: command.quantity,
          reason: command.reason,
          party: command.party,
          partyType: command.partyType,
          reference: movementCommand.reference,
          notes: command.notes,
        },
      }),
        queryRunner;

      if (command.party !== StockMovemants.OTHER_FILIAL) {
        await this.transactionService.addTransaction(
          userId,
          transactionCommand,
          queryRunner,
        );
      }

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
    const product = await this.productRepository.findByIdOrThrow(productId);
    const filial = await this.filialRepository.getBiIdOrThrow(command.filialId);
    const user = await this.userService.findUserById(userId);

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

    const transactionCommand = {
      type: await this.transactionService.determineTransactionType(
        command.party,
      ),
      category: await this.transactionService.determineCategory(command.party),
      description: await this.transactionService.generateDescription(
        command.party,
        command.partyType,
      ),
      amount: product.sellingPrice * command.quantity,
      paymentMethod:
        command.party === StockMovemants.DISCARDED ? null : PaymentMethod.CASH,
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
      } else {
        if (command.party === StockMovemants.CLIENT) {
          await this.clientRepository.updatePurchase(
            command.partyType,
            'in',
            product.sellingPrice * command.quantity,
            queryRunner,
          );
        }

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

      if (command.party !== StockMovemants.OTHER_FILIAL) {
        await this.transactionService.addTransaction(
          userId,
          transactionCommand,
          queryRunner,
        );
      }

      await this.queryRunnerService.finish(queryRunner);

      await this.productHistoryRepository.create(userId, {
        action:
          command.reason === StockMovementsReason.TRANSFER
            ? ProductHistoryAction.TRANSFER
            : ProductHistoryAction.STOCK_OUT,
        entityType: ProductHistoryType.STOCK,
        description: `Removed ${command.quantity} units ${product.name} - ${command.reason}`,
        userId: userId,
        productId,
        details: {
          filialId: command.filialId,
          quantity: command.quantity,
          reason: command.reason,
          party: command.party,
          partyType: command.partyType,
          reference: movementCommand.reference,
          notes: command.notes,
        },
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

  getAll(from?: string, to?: string): Promise<StockMovementResource[]> {
    return this.sMovementRepository.getAll(from, to);
  }
}
