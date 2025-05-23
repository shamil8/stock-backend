import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';
import { ProductEntity } from './product.entity';

@Entity({ schema: 'stock', name: 'product_histories' })
export class ProductHistoryEntity extends BaseEntity {
  @Column()
  diff!: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: false })
  isConfirm!: boolean;

  @Column()
  productId!: string;

  @ManyToOne(() => ProductEntity, (pr) => pr.productHistories)
  product?: ProductEntity;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user!: UserEntity;

  @Column({ nullable: true })
  targetId?: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  target?: UserEntity;
}
