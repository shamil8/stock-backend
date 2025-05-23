import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

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
    diff: number,
    productId: string,
    queryRunner?: QueryRunner,
  ): Promise<ProductHistoryEntity> {
    const description =
      diff > 0
        ? `Added ${diff} units to the product count`
        : `Reduced ${Math.abs(diff)} units from the product count`;

    const history = this.historyRepository.create({
      diff,
      description,
      userId,
      productId,
    });

    await this.historyRepository
      .createQueryBuilder('races', queryRunner)
      .useTransaction(!!queryRunner)
      .insert()
      .into(ProductHistoryEntity)
      .values(history)
      .execute();

    return history;
  }

  async getAllHistory(): Promise<ProductHistoryEntity[]> {
    return await this.historyRepository
      .createQueryBuilder('product_histories')
      .getMany();
  }
}
