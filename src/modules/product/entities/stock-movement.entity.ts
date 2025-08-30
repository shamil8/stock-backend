import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

import { FilialsEntity } from '../../filials/entities/filials.entity';
import { UserEntity } from '../../users/entities/user.entity';
import {
  StockMovemantsFromEnum,
  StockMovemantsType,
} from '../enums/stock-movemants.enum';
import { ProductEntity } from './product.entity';

@Entity({ schema: 'stock', name: 'stock_movements' })
export class StockMovementEntity extends BaseEntity {
  @Column({ nullable: true })
  productId!: string;

  @ManyToOne(() => ProductEntity, (product) => product.movements, {
    onDelete: 'SET NULL',
  })
  product!: ProductEntity;

  @Column()
  type!: StockMovemantsType;

  @Column({ type: 'float' })
  quantity!: number;

  @Column()
  reason!: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  userId!: string;

  @ManyToOne(() => UserEntity, (w) => w.movements, { onDelete: 'SET NULL' })
  user!: UserEntity;

  @Column({ type: 'float' })
  previousQuantity!: number;

  @Column({ type: 'float' })
  newQuantity!: number;

  @Column({ nullable: true })
  filialId!: string;

  @ManyToOne(() => FilialsEntity, (fl) => fl.movements, {
    onDelete: 'SET NULL',
  })
  filial!: FilialsEntity;

  @Column()
  party!: StockMovemantsFromEnum;

  // TODO: make from type
  @Column()
  partyType?: string;

  @Column({ nullable: true })
  reference?: string;
}
