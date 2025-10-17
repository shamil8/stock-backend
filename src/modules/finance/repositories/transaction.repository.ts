import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { TransactionCommand } from '../dto/command/transaction.command';
import { UpdateTransactionCommand } from '../dto/command/update-transaction.command';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async addTransaction(
    userId: string,
    command: TransactionCommand,
    queryRunner?: QueryRunner,
  ) {
    const transaction = this.transactionRepository.create({
      ...command,
      userId,
    });

    console.log(transaction);

    return await this.transactionRepository
      .createQueryBuilder('t', queryRunner)
      .useTransaction(!!queryRunner)
      .insert()
      .into(TransactionEntity)
      .values(transaction)
      .execute();
  }

  async getMonthlySummary(year: number) {
    return this.transactionRepository
      .createQueryBuilder('t')
      .select('EXTRACT(MONTH FROM t.createdAt)', 'month')
      .addSelect(
        `SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END)`,
        'totalIncome',
      )
      .addSelect(
        `SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END)`,
        'totalExpense',
      )
      .addSelect(`SUM(COALESCE(t.profit, 0))`, 'totalProfit')
      .where('EXTRACT(YEAR FROM t.createdAt) = :year', { year })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async getAll() {
    return await this.transactionRepository.createQueryBuilder().getMany();
  }

  async getById(id: string) {
    return await this.transactionRepository
      .createQueryBuilder('t')
      .where('t.id = :id', { id })
      .getOne();
  }

  async updateTransaction(id: string, command: UpdateTransactionCommand) {
    await this.transactionRepository
      .createQueryBuilder()
      .update()
      .set(command)
      .where('id = :id', { id })
      .execute();

    return await this.getById(id);
  }

  async deleteTransaction(id: string): Promise<boolean> {
    await this.transactionRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();

    return true;
  }
}
