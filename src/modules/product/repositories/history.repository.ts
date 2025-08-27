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

  async getAllHistory(): Promise<ProductHistoryEntity[]> {
    return await this.historyRepository
      .createQueryBuilder('product_histories')
      .getMany();
  }
}
