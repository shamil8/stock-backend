import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProductListQuery {
  @ApiProperty({
    example: 'Iphone 16 pro max',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
