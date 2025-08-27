import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import {
  StockMovemantsFromEnum,
  StockMovemantsReasonEnum,
} from '../../enums/stock-movemants.enum';

export class StockInCommand {
  @ApiProperty({
    example: 10,
    description: 'The quantity of items being added to stock',
    minimum: 1,
    required: true,
  })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty({
    example: StockMovemantsReasonEnum.PURCHASE,
    description: 'Reason for stock addition',
    required: true,
  })
  @IsEnum(StockMovemantsReasonEnum)
  @IsString()
  @IsNotEmpty()
  reason!: StockMovemantsReasonEnum;

  @ApiProperty({
    example: '5C65A38HDOT6',
    description: 'The id of warehouse or location where stock is added',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  filialId!: string;

  @ApiProperty({
    example: StockMovemantsFromEnum.SUPPLIER,
    description: 'The source name of stock',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(StockMovemantsFromEnum)
  party!: StockMovemantsFromEnum;

  @ApiProperty({
    example: 'Apple Company',
    description: 'The type of source (e.g., Supplier, Warehouse, Return)',
    required: false,
  })
  @IsString()
  @IsOptional()
  partyType?: string;

  @ApiProperty({
    example: 'Batch #2025, expires in 1 year',
    description: 'Additional notes or comments about this stock in',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
