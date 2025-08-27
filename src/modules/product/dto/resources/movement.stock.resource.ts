import { ApiProperty } from '@nestjs/swagger';

import { StockMovemantsType } from '../../enums/stock-movemants.enum';

export class StockMovementResource {
  @ApiProperty({
    description: 'Date of the movement',
    example: '2025-08-25T14:00:00Z',
  })
  createdAt!: string;

  @ApiProperty({ description: 'Name of the product', example: 'Laptop' })
  productName!: string;

  @ApiProperty({
    description: 'Type of movement',
    example: StockMovemantsType.STOCK_IN,
  })
  type!: StockMovemantsType;

  @ApiProperty({
    description: 'Name of the filial/store',
    example: 'Main Warehouse',
  })
  filialName!: string;

  @ApiProperty({ description: 'Quantity moved', example: 10 })
  quantity!: number;

  @ApiProperty({
    description: 'Type of party (supplier, customer, etc.)',
    example: 'SUPPLIER',
    required: false,
  })
  partyType?: string;

  @ApiProperty({
    description: 'Name of the user who performed the movement',
    example: 'John Doe',
  })
  userName!: string;

  @ApiProperty({
    description: 'Reference code for the movement',
    example: 'SUPPLIER-123456',
    required: false,
  })
  reference?: string;

  @ApiProperty({
    description: 'Previous quantity before the movement',
    example: 50,
  })
  previousQuantity!: number;

  @ApiProperty({ description: 'New quantity after the movement', example: 60 })
  newQuantity!: number;
}
