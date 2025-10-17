import { BaseEntity } from '@app/database/entities/base.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { ClientsEntity } from '../../clients/entities/clients.entity';
import { BorrowEntity } from '../../finance/entities/borrows.entity';
import { PaymentMethod } from '../../finance/enums/payment-method.enum';
import { UserEntity } from '../../users/entities/user.entity';
import { InvoiceStatus } from '../enums/invoice.enum';
import { SalesItemEntity } from './sales-item.entity';

@Entity({ schema: 'finance', name: 'invoice' })
export class SalesEntity extends BaseEntity {
  @Column({ unique: true })
  invoiceNumber!: string;

  @Column({ nullable: true })
  clientId!: string | null;

  @ManyToOne(() => ClientsEntity, (client) => client.invoices, {
    onDelete: 'SET NULL',
  })
  client!: ClientsEntity | null;

  @Column('text', { nullable: true })
  clientName!: string | null;

  @Column('text', { array: true })
  productIds!: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  taxRate!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  taxAmount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountAmount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total!: number;

  @Column()
  status!: InvoiceStatus;

  @Column({ nullable: true })
  paymentMethod!: PaymentMethod;

  @Column({ type: 'text', nullable: true })
  notes!: string;

  @Column({ type: 'boolean', default: false })
  isBorrow?: boolean;

  @Column({ type: 'date', nullable: true })
  returnDate?: Date;

  @Column({ nullable: true })
  cancellationReason?: string;

  @Column({ nullable: true })
  userName?: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.invoices, {
    onDelete: 'SET NULL',
  })
  user!: UserEntity;

  @OneToMany(() => SalesItemEntity, (item) => item.sale, { cascade: true })
  items!: SalesItemEntity[];

  @BeforeInsert()
  private generateInvoiceId() {
    const year = new Date().getFullYear();

    const sequentialNumber = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');

    this.invoiceNumber = `INV-${year}-${sequentialNumber}`;
  }

  @OneToOne(() => BorrowEntity, (borrow) => borrow.invoice)
  borrow!: BorrowEntity;
}
