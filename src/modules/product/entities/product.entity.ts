import { BaseEntity } from '@app/database/entities/base.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { FilialsProductsEntity } from '../../filials/entities/filials-products.entity';
import { BorrowEntity } from '../../finance/entities/borrows.entity';
import { SalesEntity } from '../../sales/entities/sales.entity';
import { SalesItemEntity } from '../../sales/entities/sales-item.entity';
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

  @Column({ type: 'float', nullable: true })
  weight?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costPrice!: number;

  @Column({ type: 'decimal', nullable: false })
  sellingPrice!: number;

  @Column('text', { array: true, nullable: false, default: [] })
  supplier!: string[];

  @Column({ nullable: true })
  imgUrl?: string;

  @Column({ default: 0 })
  count!: number;

  @Column({ type: 'text', nullable: true })
  location?: string;

  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;

  @Column({ default: ProductStatus.OUT_OF_STOCK, nullable: false })
  status?: ProductStatus;

  @Column({ nullable: true })
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

  @OneToMany(() => SalesItemEntity, (invoice) => invoice.product)
  invoices?: SalesEntity[];
}
