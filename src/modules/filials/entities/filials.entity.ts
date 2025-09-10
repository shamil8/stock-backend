import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

import { StockMovementEntity } from '../../product/entities/stock-movement.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { FilialStatus, FilialType } from '../enums/filial.enum';
import { FilialsProductsEntity } from './filials-products.entity';

@Entity({ schema: 'filials', name: 'filials' })
export class FilialsEntity extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @Column({ nullable: false })
  type!: FilialType;

  @Column({ nullable: true })
  address?: string;

  @Column()
  city!: string;

  @Column()
  country!: string;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  manager?: string;

  @Column({ nullable: false })
  status!: FilialStatus;

  @Column()
  openingHours!: string;

  @Column({ type: 'int', default: 0 })
  capacity!: number;

  @OneToMany(() => UserEntity, (us) => us.filials)
  users!: UserEntity[];

  @OneToMany(() => FilialsProductsEntity, (fp) => fp.filial)
  products!: FilialsProductsEntity[];

  @OneToMany(() => StockMovementEntity, (st) => st.filial)
  movements!: StockMovementEntity[];
}
