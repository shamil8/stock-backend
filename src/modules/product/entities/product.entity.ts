import { BaseEntity } from '@app/database/entities/base.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ schema: 'stock', name: 'products' })
export class ProductEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  weight?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column()
  picture!: string;

  @Column()
  count!: number;

  @ManyToOne(() => CategoryEntity, { onDelete: 'SET NULL', nullable: true })
  category?: CategoryEntity;
}
