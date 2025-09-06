import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';
import { TransactionStatus } from '../enums/traansaction-status.enum';

@Entity({ schema: 'finance', name: 'transaction' })
export class TransactionEntity extends BaseEntity {
  @Column({ nullable: false })
  type!: string;

  @Column({ nullable: false })
  category!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'float', nullable: false })
  amount!: number;

  @Column({ nullable: false })
  paymentMethod!: string;

  @Column({ nullable: false, default: TransactionStatus.COMPLETED })
  status!: string;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => UserEntity, (u) => u.transactions)
  user!: UserEntity;
}
