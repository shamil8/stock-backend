import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class HistoryCommand {
  @ApiProperty({
    example: 'LDQ39UE45V4B',
    description: 'The id of the product',
  })
  @IsString()
  productId!: string;

  @IsNumber()
  @ApiProperty({
    example: -12,
    description: 'the amount of change that occurs',
    required: false,
  })
  diff?: number;

  @ApiProperty({
    example: 'History description',
    description: 'Description for history count.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
