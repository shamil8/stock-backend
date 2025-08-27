import { BaseEntity } from '@app/database/entities/base.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { FilialsProductsEntity } from '../../filials/entities/filials-products.entity';
import { ProductStatus } from '../enums/product-status.enum';
import { ProductHistoryEntity } from './productHistory.entity';
import { StockMovementEntity } from './stock-movement.entity';

@Entity({ schema: 'stock', name: 'products' })
export class ProductEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  brand?: string;

  @Column({ type: 'text', nullable: true })
  sku?: string;

  @Column({ type: 'int', nullable: false })
  minStock!: number;

  @Column({ type: 'int', nullable: false })
  maxStock!: number;

  @Column({ nullable: true })
  weight?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costPrice!: number;

  @Column({ type: 'decimal', nullable: false })
  sellingPrice!: number;

  @Column({ type: 'text', nullable: false })
  supplier!: string;

  @Column({ nullable: true })
  imgUrl?: string;

  @Column({ default: 0 })
  count!: number;

  @Column({ type: 'text', nullable: true })
  location?: string;

  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;

  @Column({ default: 'Out of stock', nullable: true })
  status?: ProductStatus;

  @Column()
  categoryId!: string;

  @ManyToOne(() => CategoryEntity, (category) => category.product, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  category!: CategoryEntity;

  @OneToMany(() => ProductHistoryEntity, (ph) => ph.product)
  productHistories?: ProductHistoryEntity[];

  @OneToMany(() => StockMovementEntity, (movement) => movement.product)
  movements?: StockMovementEntity[];

  @OneToMany(() => FilialsProductsEntity, (fp) => fp.product)
  filials!: FilialsProductsEntity[];
}
