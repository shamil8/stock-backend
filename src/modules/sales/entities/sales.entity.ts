// import { BaseEntity } from '@app/database/entities/base.entity';
// import { Column, Entity, ManyToOne } from 'typeorm';
//
// import { ClientsEntity } from '../../clients/entities/clients.entity';
// import { ProductEntity } from '../../product/entities/product.entity';
// import { UserEntity } from '../../users/entities/user.entity';
//
// @Entity({ schema: 'finance', name: 'invoice' })
// export class InvoiceEntity extends BaseEntity {
//   @Column()
//   invoiceNumber!: string;
//
//   @Column()
//   clientId!: string;
//
//   @ManyToOne(() => ClientsEntity, (cl) => cl.invoices, { onDelete: 'SET NULL' })
//   client?: ClientsEntity[];
//
//   @Column()
//   userId!: string;
//
//   @ManyToOne(() => UserEntity, (user) => user.invoices)
//   user!: UserEntity;
//
//   @Column()
//   productId!: string;
//
//   @ManyToOne(() => ProductEntity, (product) => product.invoice)
//   product?: ProductEntity;
// }
