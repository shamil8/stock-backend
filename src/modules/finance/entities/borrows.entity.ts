import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

import { SalesEntity } from '../../sales/entities/sales.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { BorrowParty, BorrowsStatus, BorrowType } from '../enums/borrows.enum';

@Entity({ schema: 'finance', name: 'borrows' })
export class BorrowEntity extends BaseEntity {
  @Column()
  type!: BorrowType;

  @Column('float')
  amount!: number;

  @Column('float', { default: 0 })
  profit!: number;

  @Column()
  partyType!: BorrowParty;

  @Column()
  partyName!: string;

  @Column({ nullable: true })
  returnDate?: Date;

  @Column({ default: BorrowsStatus.ACTIVE })
  status!: BorrowsStatus;

  @Column({ nullable: true })
  userId!: string;

  @Column()
  userName!: string;

  @Column()
  invoiceId!: string;

  @OneToOne(() => SalesEntity)
  invoice!: SalesEntity;

  @ManyToOne(() => UserEntity, (user) => user.borrows, { onDelete: 'SET NULL' })
  user!: UserEntity;

  @Column('text', { nullable: true })
  notes?: string;
}
