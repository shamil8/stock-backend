import { IsOptional } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';
import { ProductEntity } from './product.entity';

@Entity({ schema: 'stock', name: 'product_histories' })
export class ProductHistoryEntity extends UserEntity {
  @Column()
  diff!: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  targetId?: string;

  @Column({ default: false })
  isConfirm!: boolean;

  @Column()
  productId!: string;

  @ManyToOne(() => ProductEntity, (pr) => pr.productHistories)
  @JoinColumn({ name: 'product_id' })
  product?: ProductEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user?: UserEntity;
}
