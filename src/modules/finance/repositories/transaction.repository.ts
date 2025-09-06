import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransactionCommand } from '../dto/command/transaction.command';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async addTransaction(command: TransactionCommand) {
    const transaction = this.transactionRepository.create(command);

    return await this.transactionRepository.save(transaction);
  }
}
