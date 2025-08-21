import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

import { ProductEntity } from '../../product/entities/product.entity';
import { FilialsEntity } from './filials.entity';

@Entity({ schema: 'stock', name: 'filials-products' })
export class FilialsProductsEntity extends BaseEntity {
  @Column()
  filialId!: string;

  @ManyToOne(() => FilialsEntity, (filial) => filial.products, {
    onDelete: 'CASCADE',
  })
  filial!: FilialsEntity;

  @Column()
  productId!: string;

  @ManyToOne(() => ProductEntity, (product) => product.filials, {
    onDelete: 'CASCADE',
  })
  product!: ProductEntity;

  @Column({ type: 'int', default: 0 })
  count!: number;
}
