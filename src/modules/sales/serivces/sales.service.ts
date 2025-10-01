import { HttpStatus, Injectable } from '@nestjs/common';
import { QueryRunnerService } from '@app/database/services/query-runner.service';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { ClientsRepository } from '../../clients/repositories/clients.repository';
import {
  BorrowParty,
  BorrowsStatus,
  BorrowType,
} from '../../finance/enums/borrows.enum';
import { TransactionType } from '../../finance/enums/transaction-type.enum';
import { BorrowsRepository } from '../../finance/repositories/borrows.repository';
import { TransactionRepository } from '../../finance/repositories/transaction.repository';
import { ProductRepository } from '../../product/repositories/product.repository';
import { UserService } from '../../users/services/user.service';
import { InvoiceCommand } from '../dto/command/invoice.command';
import { UpdateInvoiceStatusCommand } from '../dto/command/update-invoice-status.command';
import { InvoiceStatus } from '../enums/invoice.enum';
import { SalesRepository } from '../repositories/sales.repository';

@Injectable()
export class SalesService {
  constructor(
    private readonly clientsRepository: ClientsRepository,
    private readonly userService: UserService,
    private readonly salesRepository: SalesRepository,
    private readonly queryRunnerService: QueryRunnerService,
    private readonly borrowRepository: BorrowsRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(command: InvoiceCommand, userId: string) {
    let clientId: string | null = null;
    let clientName: string | null = null;

    if (command.clientId) {
      const client = await this.clientsRepository.findById(command.clientId);

      if (client) {
        clientId = client.id;
        clientName = client.userName;

        const checkClient = await this.clientsRepository.findClientByIdOrThrow(
          command.clientId,
        );

        if (
          command.borrow &&
          checkClient.currentDebt! + command.total > checkClient.creditLimit!
        ) {
          throw new AppHttpException(
            ExceptionMessage.REACHED_CLIENT_CREDIT_LIMIT,
            HttpStatus.BAD_REQUEST,
            ExceptionLocalCode.CLIENT_NOT_FOUND,
          );
        }
      } else {
        clientId = null;
        clientName = command.clientId;
      }
    }

    const user = await this.userService.findUserById(userId);

    console.log('user', user);

    const productIds = command.items.map((item) => item.productId);

    const saleToSave = {
      clientId,
      clientName,
      subtotal: command.subtotal,
      taxRate: command.taxRate,
      taxAmount: command.taxAmount,
      discountAmount: command.discountAmount,
      total: command.total,
      status: InvoiceStatus.DRAFT,
      paymentMethod: command.paymentMethod,
      notes: command.notes,
      isBorrow: command.borrow,
      cancellationReason: command.cancellationReason,
      userId: user.id,
      userName: user.firstName + ' ' + user.lastName,
      productIds,
      items: command.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        discount: item.discount,
        total: item.total,
      })),
    };

    return await this.salesRepository.addInvoice(saleToSave);
  }

  async updateStatus(
    saleId: string,
    command: UpdateInvoiceStatusCommand,
    userId: string,
  ) {
    const sale = await this.salesRepository.findById(saleId);

    if (command.status === InvoiceStatus.PAID) {
      let profit = 0;

      if (sale) {
        const profitPerProduct = await Promise.all(
          sale.items.map(async (item) => {
            const product = await this.productRepository.findByIdOrThrow(
              item.productId,
            );

            return (product.sellingPrice - product.costPrice) * item.quantity;
          }),
        );

        profit = profitPerProduct.reduce((sum, p) => sum + p, 0);
      }

      console.log('afffterrrsale');
      const user = await this.userService.findUserById(userId);

      let transactionType = TransactionType.INCOME;

      const queryRunner = await this.queryRunnerService.create();

      try {
        if (sale.isBorrow) {
          if (sale.clientId) {
            await this.clientsRepository.addDebt(
              sale.clientId,
              sale.total,
              queryRunner,
            );
            transactionType = TransactionType.EXPENSE;
          }

          await this.borrowRepository.addBorrow(
            {
              type: BorrowType.LEND,
              amount: sale.total,
              profit: profit,
              partyType: BorrowParty.CLIENT,
              partyName: sale.clientName!,
              returnDate: sale.returnDate,
              status: BorrowsStatus.ACTIVE,
              userId,
              userName: user.firstName + ' ' + user.lastName,
              invoiceId: sale.id,
              notes: sale.notes,
            },
            queryRunner,
          );
        }

        // await this.filialProductRepository.update(user.filialsId, )

        await this.transactionRepository.addTransaction(userId, {
          type: transactionType,
          category: 'Sales Revenue',
          description: `${sale.clientName ? sale.clientName + 'купил' : 'продаж'} купил продукты`,
          amount: sale.total,
          paymentMethod: sale.paymentMethod,
          profit: transactionType === TransactionType.INCOME ? profit : 0,
        });

        await this.queryRunnerService.finish(queryRunner);

        await this.salesRepository.updateInvoiceStatus(
          saleId,
          command.status,
          command.cancellationReason,
        );

        return await this.salesRepository.findById(saleId);
      } catch (err) {
        await this.queryRunnerService.rollback(queryRunner);

        throw err;
      }
    }

    return this.salesRepository.updateInvoiceStatus(saleId, command.status);
  }

  getAllInvoices() {
    return this.salesRepository.getAllInvoices();
  }

  // updateInvoice(id: string, command: UpdateInvoiceStatusCommand) {
  //   return this.salesRepository.updateInvoice(id, command);
  // }
}
