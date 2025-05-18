import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { ProductEntity } from '../../product/entities/product.entity';

@Entity({ schema: 'stock', name: 'categories' })
export class CategoryEntity extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  parentId?: string;

  @ManyToOne(() => CategoryEntity, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent?: CategoryEntity;

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children?: CategoryEntity[];

  @OneToMany(() => ProductEntity, (pr) => pr.category)
  product?: ProductEntity[];
}
