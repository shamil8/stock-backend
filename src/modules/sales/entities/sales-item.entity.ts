import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

import { ProductEntity } from '../../product/entities/product.entity';
import { SalesEntity } from './sales.entity';

@Entity({ schema: 'finance', name: 'salesItem' })
export class SalesItemEntity extends BaseEntity {
  @Column()
  saleId!: string;

  @ManyToOne(() => SalesEntity, (sale) => sale.items, { onDelete: 'CASCADE' })
  sale!: SalesEntity;

  @Column()
  productId!: string;

  @ManyToOne(() => ProductEntity)
  product!: ProductEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount!: number;

  @Column()
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total!: number;
}
