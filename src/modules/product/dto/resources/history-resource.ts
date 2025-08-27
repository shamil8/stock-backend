import { ApiProperty } from '@nestjs/swagger';

import {
  ProductHistoryAction,
  ProductHistoryType,
} from '../../enums/product-history.enum';

export class HistoryResource {
  @ApiProperty({ description: 'ID of the history record', example: 'HIS123' })
  id!: string;

  @ApiProperty({
    description: 'Action performed',
    example: ProductHistoryAction.STOCK_IN,
    enum: ProductHistoryAction,
  })
  action!: ProductHistoryAction;

  @ApiProperty({
    description: 'Type of entity',
    example: ProductHistoryType.PRODUCT,
    enum: ProductHistoryType,
  })
  entityType!: ProductHistoryType;

  @ApiProperty({
    description: 'Optional description or notes',
    example: 'Added 10 units to stock',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'ID of the user who performed the action',
    example: 'USR123',
  })
  userId!: string;

  @ApiProperty({ description: 'Product ID', example: 'PROD123' })
  productId?: string;

  @ApiProperty({
    description: 'Optional details in JSON format',
    required: false,
  })
  details?: any;
}
