import { ApiProperty } from '@nestjs/swagger';

import { CategoryEntity } from '../../entities/category.entity';

export class CategoryResource {
  @ApiProperty({
    required: true,
    example: 'EKFKV2WCDJK8',
    description: 'Category ID',
  })
  id!: string;

  @ApiProperty({
    example: 'Transport',
    description: 'This category is used for names of transports category.',
  })
  name!: string;

  @ApiProperty({
    example: 'This category is about transports',
    description:
      'This category is used for description of transports category.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    type: [CategoryResource],
    example: ['CategoryResource'],
    description: 'Sub categories',
    required: false,
  })
  children?: CategoryResource[];

  constructor(entity: CategoryEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.description = entity.description;

    if (entity.children) {
      this.children = entity.children.map(
        (child) => new CategoryResource(child),
      );
    }
  }
}
