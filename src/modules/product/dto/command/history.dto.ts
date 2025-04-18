import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class HistoryDto {
  @ApiProperty({
    example: 'LDQ39UE45V4B',
    description: 'The id of the product',
  })
  @IsString()
  productid!: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  userid!: string;

  @IsOptional()
  @IsNumber()
  diff!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  targetid?: string;
}
