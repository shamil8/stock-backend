import { ApiProperty } from '@nestjs/swagger';

export class HistoryResource {
  @ApiProperty({
    example: 'LDQ39UE45V4B',
    description: 'The id of the product',
    required: false,
  })
  productId!: string;

  @ApiProperty({
    example: 'ZNOH4738HITA',
    description: 'The id of the user',
    required: false,
  })
  targetId?: string;
  @ApiProperty({
    example: -12,
  })
  diff!: number;

  description?: string;
}
