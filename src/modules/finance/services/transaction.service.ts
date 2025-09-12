import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

import { StockMovemants } from '../../product/enums/stock-movemants.enum';
import { TransactionCommand } from '../dto/command/transaction.command';
import { UpdateTransactionCommand } from '../dto/command/update-transaction.command';
import { TransactionType } from '../enums/transaction-type.enum';
import { TransactionRepository } from '../repositories/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async addTransaction(
    userId: string,
    command: TransactionCommand,
    queryRunner?: QueryRunner,
  ) {
    return this.transactionRepository.addTransaction(
      userId,
      command,
      queryRunner,
    );
  }

  getMonthlySummary(year: number) {
    return this.transactionRepository.getMonthlySummary(year);
  }

  getAll() {
    return this.transactionRepository.getAll();
  }

  updateTransaction(id: string, command: UpdateTransactionCommand) {
    return this.transactionRepository.updateTransaction(id, command);
  }

  determineTransactionType(party: StockMovemants): TransactionType {
    if (party === StockMovemants.RETURN_FROM_CUSTOMER) {
      return TransactionType.EXPENSE;
    }

    switch (party) {
      case StockMovemants.SUPPLIER:
        return TransactionType.EXPENSE;
      case StockMovemants.CLIENT:
        return TransactionType.INCOME;
      case StockMovemants.DISCARDED:
        return TransactionType.EXPENSE;
      default:
        return TransactionType.EXPENSE;
    }
  }

  determineCategory(party: StockMovemants): string {
    switch (party) {
      case StockMovemants.SUPPLIER:
        return 'Purchase';
      case StockMovemants.CLIENT:
        return 'Sales Revenue';
      case StockMovemants.OTHER_FILIAL:
        return 'Transfer';
      case StockMovemants.DISCARDED:
        return 'Loss';
      default:
        return 'Other';
    }
  }

  generateDescription(
    party: StockMovemants,
    partyType: string,
    notes?: string,
  ): string {
    const baseDescription = `${party} transaction with ${partyType}`;

    return notes ? `${baseDescription} - ${notes}` : baseDescription;
  }
}
