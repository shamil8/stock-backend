import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

import { FilialsEntity } from '../../filials/entities/filials.entity';
import {
  StockMovemantsFromEnum,
  StockMovemantsReasonEnum,
  StockMovemantsTypeEnum,
} from '../enums/stock-movemants.enum';
import { ProductEntity } from './product.entity';

@Entity({ schema: 'stock', name: 'stock-movement' })
export class StockMovementEntity extends BaseEntity {
  @Column()
  productId!: string;

  @ManyToOne(() => ProductEntity, (product) => product.movements)
  product!: ProductEntity;

  @Column()
  type!: StockMovemantsTypeEnum;

  @Column('int')
  quantity!: number;

  @Column()
  reason!: StockMovemantsReasonEnum;

  @Column({ nullable: true })
  notes?: string;

  // TODO: make locations
  @Column()
  filialId!: string;

  @ManyToOne(() => FilialsEntity, (fl) => fl.movements)
  filial!: FilialsEntity;

  @Column()
  party!: StockMovemantsFromEnum;

  // TODO: make from type
  @Column()
  partyType?: string;
}
