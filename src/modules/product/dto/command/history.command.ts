import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class HistoryCommand {
  @ApiProperty({
    example: 'LDQ39UE45V4B',
    description: 'The id of the product',
  })
  @IsString()
  productid!: string;

  @ApiProperty({
    example: 'ZNOH4738HITA',
    description: 'The id of the user',
  })
  @IsString()
  targetId!: string;
  @IsNumber()
  @ApiProperty({
    example: -12,
  })
  diff!: number;

  @IsOptional()
  @IsString()
  description?: string;
}
