import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

import { FilialsEntity } from '../../filials/entities/filials.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { WorkersEntity } from '../../workers/entities/workers.entity';
import {
  StockMovemantsFromEnum,
  StockMovemantsType,
} from '../enums/stock-movemants.enum';
import { ProductEntity } from './product.entity';

@Entity({ schema: 'stock', name: 'stock_movements' })
export class StockMovementEntity extends BaseEntity {
  @Column()
  productId!: string;

  @ManyToOne(() => ProductEntity, (product) => product.movements)
  product!: ProductEntity;

  @Column()
  type!: StockMovemantsType;

  @Column({ type: 'float' })
  quantity!: number;

  @Column()
  reason!: string;

  @Column({ nullable: true })
  notes?: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, (w) => w.movements)
  user!: UserEntity;

  @Column({ type: 'float' })
  previousQuantity!: number;

  @Column({ type: 'float' })
  newQuantity!: number;

  @Column({ nullable: false })
  filialId!: string;

  @ManyToOne(() => FilialsEntity, (fl) => fl.movements)
  filial!: FilialsEntity;

  @Column()
  party!: StockMovemantsFromEnum;

  // TODO: make from type
  @Column()
  partyType?: string;

  @Column({ nullable: true })
  reference?: string;
}
