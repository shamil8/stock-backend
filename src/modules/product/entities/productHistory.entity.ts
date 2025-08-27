import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';
import {
  ProductHistoryAction,
  ProductHistoryType,
} from '../enums/product-history.enum';
import { ProductEntity } from './product.entity';

@Entity({ schema: 'stock', name: 'product_histories' })
export class ProductHistoryEntity extends BaseEntity {
  @Column({ type: 'enum', enum: ProductHistoryAction })
  action!: ProductHistoryAction;

  @Column({ type: 'enum', enum: ProductHistoryType })
  entityType!: ProductHistoryType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, (us) => us.productHistory)
  user!: UserEntity;

  @Column({ nullable: true })
  productId?: string;

  @ManyToOne(() => ProductEntity, (pr) => pr.productHistories)
  product?: ProductEntity;

  @Column({ type: 'json', nullable: true })
  details?: any;
}
