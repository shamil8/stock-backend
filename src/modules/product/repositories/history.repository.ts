import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, QueryRunner, Repository } from 'typeorm';

import { ProductHistoryEntity } from '../entities/productHistory.entity';

@Injectable()
export class HistoryRepository {
  constructor(
    @InjectRepository(ProductHistoryEntity)
    private readonly historyRepository: Repository<ProductHistoryEntity>,
  ) {}

  /** Create **/
  async create(
    userId: string,
    command: DeepPartial<ProductHistoryEntity>,
    queryRunner?: QueryRunner,
  ): Promise<DeepPartial<ProductHistoryEntity>> {
    command.userId = userId;

    const history = await this.historyRepository.create(command);

    await this.historyRepository
      .createQueryBuilder('races', queryRunner)
      .useTransaction(!!queryRunner)
      .insert()
      .into(ProductHistoryEntity)
      .values(history)
      .execute();

    return command;
  }

  async getAllHistory(
    from?: string,
    to?: string,
  ): Promise<ProductHistoryEntity[]> {
    const qb = await this.historyRepository
      .createQueryBuilder('ph')
      .orderBy('ph.createdAt', 'DESC');

    if (from) {
      const [day, month, year] = from.split('-').map(Number);
      const fromDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));

      qb.andWhere('ph.createdAt >= :from', { from: fromDate });
    }

    if (to) {
      const [day, month, year] = to.split('-').map(Number);
      const toDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));

      qb.andWhere('ph.createdAt <= :to', { to: toDate });
    }

    return qb.getRawMany();
  }
}
