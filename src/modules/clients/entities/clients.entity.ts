import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Unique } from 'typeorm';

import { ClientStatusEnum } from '../enums/client-status.enum';
import { ClientTypeEnum } from '../enums/client-type.enum';

@Entity({ schema: 'users', name: 'clients' })
@Unique(['email'])
export class ClientsEntity extends BaseEntity {
  @Column()
  userName!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column()
  address?: string;

  @Column()
  type!: ClientTypeEnum;

  @Column({ default: ClientStatusEnum.ACTIVE })
  status!: ClientStatusEnum;

  @Column({ default: 0 })
  creditLimit?: number;

  @Column({ default: 0 })
  currentDebt?: number;

  @Column({ default: 0 })
  totalPurchases!: number;

  @Column({ nullable: true })
  lastPurchase?: Date;

  @Column()
  notes?: string;

  // @OneToMany(() => InvoiceEntity, (invoice) => invoice.client)
  // invoices?: InvoiceEntity[];
}
