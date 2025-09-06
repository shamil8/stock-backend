import { ApiProperty } from '@nestjs/swagger';

import { StockMovemants } from '../../enums/stock-movemants.enum';

export class StockMovementResource {
  @ApiProperty({
    example: 'stock_123',
    description: 'ID of the stock movement',
  })
  id!: string;

  @ApiProperty({ example: 'prod_456', description: 'ID of the product' })
  productId!: string;

  @ApiProperty({ example: 'Laptop', description: 'Name of the product' })
  productName!: string;

  @ApiProperty({
    example: 'stock_in',
    description: 'Type of stock movement',
    enum: ['stock_in', 'stock_out', 'adjustment', 'transfer'],
  })
  type!: 'stock_in' | 'stock_out' | 'adjustment' | 'transfer';

  @ApiProperty({
    example: 10,
    description: 'Quantity involved in this movement',
  })
  quantity!: number;

  @ApiProperty({
    example: 'Initial stock',
    description: 'Reason for the movement',
  })
  reason!: string;

  @ApiProperty({
    example: 'Some notes',
    description: 'Optional notes',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    example: 'Sharaf Niyozov',
    description: 'User who performed the action',
  })
  performedBy!: string;

  @ApiProperty({
    example: '2025-09-03T15:00:00.000Z',
    description: 'Date of the movement',
  })
  date!: string;

  @ApiProperty({ example: 5, description: 'Previous quantity in stock' })
  previousQuantity!: number;

  @ApiProperty({ example: 15, description: 'New quantity in stock' })
  newQuantity!: number;

  @ApiProperty({ example: 'filial_001', description: 'ID of the store/filial' })
  storeId!: string;

  @ApiProperty({
    example: 'Main Store',
    description: 'Name of the store/filial',
  })
  storeName!: string;

  @ApiProperty({
    description: 'The party involved in the stock movement',
  })
  party?: StockMovemants;

  @ApiProperty({ example: 'supplier', description: 'Type of the party' })
  partyType!: string;

  @ApiProperty({
    example: 'SUPPLIER-1693732290000',
    description: 'Reference for the movement',
  })
  reference!: string;

  constructor(data: Partial<StockMovementResource>) {
    Object.assign(this, data);
  }
}
