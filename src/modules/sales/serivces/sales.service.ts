import { HttpStatus, Injectable } from '@nestjs/common';
import { QueryRunnerService } from '@app/database/services/query-runner.service';
import { log } from 'winston';

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
          Number(checkClient.currentDebt)! + command.total >
            Number(checkClient.creditLimit)!
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
    console.log('0000-0000');
    const sale = await this.salesRepository.findById(saleId);

    console.log('11111111');

    console.log('statuuuuusss: ', command.status, sale.status);

    if (
      command.status === InvoiceStatus.PAID ||
      command.status === InvoiceStatus.BORROW
    ) {
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

      console.log('22222222');

      const user = await this.userService.findUserById(userId);

      let transactionType = TransactionType.INCOME;

      const queryRunner = await this.queryRunnerService.create();

      console.log('is borrow: ', sale.isBorrow);
      try {
        if (sale.isBorrow) {
          console.log('borrow');

          if (sale.clientId) {
            await this.clientsRepository.addDebt(
              sale.clientId,
              sale.total,
              queryRunner,
            );
            console.log('client borrow');
            transactionType = TransactionType.BORROW;
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
          console.log('added borrow');
        }

        console.log('blabla', sale.total, typeof sale.total);

        if (sale.clientId && !sale.isBorrow) {
          await this.clientsRepository.updatePurchase(
            sale.clientId,
            'in',
            Number(sale.total),
            queryRunner,
          );
          console.log(Number(sale.total));
          console.log('end blabla');
        }

        // await this.filialProductRepository.update(user.filialsId, )

        await this.transactionRepository.addTransaction(userId, {
          type: transactionType,
          category: 'Sales Revenue',
          description: `${sale.clientName ? sale.clientName + 'купил' : 'продаж'} продукты`,
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
