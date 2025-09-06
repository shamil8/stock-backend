import { Injectable } from '@nestjs/common';

import { TransactionCommand } from '../dto/command/transaction.command';
import { TransactionRepository } from '../repositories/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  addTransaction(command: TransactionCommand) {
    return this.transactionRepository.addTransaction(command);
  }
}
