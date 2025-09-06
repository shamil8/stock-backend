import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, QueryRunner, Repository } from 'typeorm';

import { StockMovementResource } from '../dto/resources/movement.stock.resource';
import { StockMovementEntity } from '../entities/stock-movement.entity';
import { StockMovemantsType } from '../enums/stock-movemants.enum';

@Injectable()
export class StockMovementRepository {
  constructor(
    @InjectRepository(StockMovementEntity)
    private readonly stockMovementRepository: Repository<StockMovementEntity>,
  ) {}

  async stockIn(
    productId: string,
    command: DeepPartial<StockMovementEntity>,
    queryRunner?: QueryRunner,
  ) {
    const movement: DeepPartial<StockMovementEntity> = {
      productId,
      userId: command.userId,
      filialId: command.filialId,
      type: StockMovemantsType.STOCK_IN,
      quantity: command.quantity,
      previousQuantity: command.previousQuantity,
      newQuantity: command.newQuantity,
      reason: command.reason,
      party: command.party,
      partyType: command.partyType,
      reference: `${command.party?.toUpperCase()}-${Date.now()}`,
      notes: command.notes,
    };

    const insert = this.stockMovementRepository.create(movement);

    const save = await this.stockMovementRepository
      .createQueryBuilder('s', queryRunner)
      .useTransaction(!!queryRunner)
      .insert()
      .into(StockMovementEntity)
      .values(insert)
      .returning('*')
      .execute();

    return save;
  }

  async stockOut(
    productId: string,
    command: DeepPartial<StockMovementEntity>,
    queryRunner?: QueryRunner,
  ) {
    const movement: DeepPartial<StockMovementEntity> = {
      productId,
      userId: command.userId,
      filialId: command.filialId,
      type: StockMovemantsType.STOCK_OUT,
      quantity: command.quantity,
      previousQuantity: command.previousQuantity,
      newQuantity: command.newQuantity,
      reason: command.reason,
      party: command.party,
      partyType: command.partyType,
      reference: `${command.party?.toUpperCase()}-${Date.now()}`,
      notes: command.notes,
    };

    const insert = this.stockMovementRepository.create(movement);

    const save = await this.stockMovementRepository
      .createQueryBuilder('c', queryRunner)
      .useTransaction(!!queryRunner)
      .insert()
      .into(StockMovementEntity)
      .values(insert)
      .returning('*')
      .execute();

    return save;
  }

  async getAll(): Promise<StockMovementResource[]> {
    const movements = await this.stockMovementRepository
      .createQueryBuilder('sm')
      .leftJoinAndSelect('sm.product', 'pr')
      .leftJoinAndSelect('sm.filial', 'fl')
      .leftJoinAndSelect('sm.user', 'us')
      .select([
        'sm.createdAt as createdAt',
        'pr.name as productName',
        'sm.type as type',
        'fl.name as filialName',
        'sm.quantity as quantity',
        'sm.partyType as partyType',
        'us.firstName as userName',
        'sm.reference as reference',
        'sm.previousQuantity as previousQuantity',
        'sm.newQuantity as newQuantity',
      ])
      .getRawMany();

    return movements;
  }
}
