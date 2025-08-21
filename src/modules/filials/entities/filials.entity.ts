import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

import { StockMovementEntity } from '../../product/entities/stock-movement.entity';
import { WorkersEntity } from '../../workers/entities/workers.entity';
import { FilialStatusEnum, FilialTypeEnum } from '../enums/filial.enum';
import { FilialsProductsEntity } from './filials-products.entity';

@Entity({ schema: 'filials', name: 'filials' })
export class FilialsEntity extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @Column({ nullable: false })
  type!: FilialTypeEnum;

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
  status!: FilialStatusEnum;

  @Column()
  openingHours!: string;

  @Column({ type: 'int', default: 0 })
  capacity!: number;

  @OneToMany(() => WorkersEntity, (pr) => pr.filial)
  workers!: WorkersEntity[];

  @OneToMany(() => FilialsProductsEntity, (fp) => fp.filial)
  products!: FilialsProductsEntity[];

  @OneToMany(() => StockMovementEntity, (st) => st.filial)
  movements!: StockMovementEntity[];
}
