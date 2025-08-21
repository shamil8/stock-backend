import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunnerService } from '@app/database/services/query-runner.service';
import { DeepPartial, QueryRunner, Repository } from 'typeorm';

import { StockInCommand } from '../dto/command/stock-in.command';
import { StockMovementEntity } from '../entities/stock-movement.entity';
import { StockMovemantsTypeEnum } from '../enums/stock-movemants.enum';
import { ProductRepository } from './product.repository';

@Injectable()
export class StockMovementRepository {
  constructor(
    @InjectRepository(StockMovementEntity)
    private readonly stockMovementRepository: Repository<StockMovementEntity>,
    private readonly productRepository: ProductRepository,
    private readonly queryRunnerService: QueryRunnerService,
  ) {}

  async stockIn(
    productId: string,
    command: StockInCommand,
    queryRunner?: QueryRunner,
  ) {
    const movement = this.stockMovementRepository.create({
      productId: productId,
      type: StockMovemantsTypeEnum.STOCK_IN,
      quantity: command.quantity,
      reason: command.reason,
      filialId: command.filial,
      party: command.party,
      partyType: command.partyType,
    } as DeepPartial<StockMovementEntity>);

    return await this.stockMovementRepository
      .createQueryBuilder('s', queryRunner)
      .useTransaction(!!queryRunner)
      .insert()
      .into(StockMovementEntity)
      .values(movement)
      .execute();
  }

  async stockOut(
    productId: string,
    command: StockInCommand,
    queryRunner?: QueryRunner,
  ) {
    const movement = this.stockMovementRepository.create({
      productId: productId,
      type: StockMovemantsTypeEnum.STOCK_OUT,
      quantity: command.quantity,
      reason: command.reason,
      filialId: command.filial,
      party: command.party,
      partyType: command.partyType,
    });

    return await this.stockMovementRepository
      .createQueryBuilder('c', queryRunner)
      .useTransaction(!!queryRunner)
      .insert()
      .into(StockMovementEntity)
      .values(movement)
      .execute();
  }
}
