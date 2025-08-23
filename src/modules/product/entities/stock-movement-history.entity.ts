import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

import { ProductEntity } from './product.entity';

@Entity({ schema: 'stock', name: 'stock-movement-history' })
export class StockMovementHistoryEntity extends BaseEntity {
  @Column()
  productId!: string;

  @ManyToOne(() => ProductEntity, (product) => product.movementsHistory)
  product!: ProductEntity;

  @Column()
  type!: string;

  @Column()
  quantity!: number;

  @Column()
  reason!: string;

  @Column({ nullable: true })
  note?: string;

  @Column()
  repformerdBy!: string;

  @Column()
  previousQuantity!: number;

  @Column()
  nextQuantity!: number;

  @Column()
  storeId!: string;

  @Column()
  supplier!: string;

  @Column()
  fromStore?: string;

  @Column()
  toStore?: string;

  @Column()
  customerId!: string;
}
