import { BaseEntity } from '@app/database/entities/base.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { ProductHistoryEntity } from './productHistory.entity';

@Entity({ schema: 'stock', name: 'products' })
export class ProductEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  weight?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ nullable: true })
  imgUrl?: string;

  @Column()
  count!: number;

  @Column()
  categoryId!: string;

  @ManyToOne(() => CategoryEntity, (category) => category.product, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  category!: CategoryEntity;

  @OneToMany(() => ProductHistoryEntity, (ph) => ph.product)
  productHistories?: ProductHistoryEntity[];
}
