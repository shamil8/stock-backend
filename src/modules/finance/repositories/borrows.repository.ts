import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { BorrowCommand } from '../dto/command/borrow.command';
import { UpdateBorrowCommand } from '../dto/command/update-borrow.command';
import { BorrowEntity } from '../entities/borrows.entity';

@Injectable()
export class BorrowsRepository {
  constructor(
    @InjectRepository(BorrowEntity)
    private readonly borrowsRepository: Repository<BorrowEntity>,
  ) {}

  async addBorrow(command: BorrowCommand, queryRunner?: QueryRunner) {
    const borrow = this.borrowsRepository.create(command);

    return await this.borrowsRepository
      .createQueryBuilder('b', queryRunner)
      .useTransaction(!!queryRunner)
      .insert()
      .into(BorrowEntity)
      .values(borrow)
      .execute();
  }

  async getAll(): Promise<BorrowEntity[]> {
    return this.borrowsRepository
      .createQueryBuilder('b')
      .orderBy('b.createdAt', 'DESC')
      .getMany();
  }

  async updateBorrow(userId: string, id: string, command: UpdateBorrowCommand) {
    await this.borrowsRepository
      .createQueryBuilder()
      .update()
      .set({ amount: () => 'amount - :reduce' })
      .where('id = :id', { id })
      .setParameters({ reduce: command.amount })
      .execute();

    return true;
  }
}
