import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ schema: 'stock', name: 'categories' })
export class CategoryEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => CategoryEntity, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent?: CategoryEntity;

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children?: CategoryEntity[];
}
