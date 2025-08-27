import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { ProductStatus } from '../../enums/product-status.enum';

export class ProductCommand {
  @ApiProperty({ example: 'iphone 13 pro', description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'iphone 13 pro with 1tb',
    description: 'Description of the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'Apple',
    description: 'Brand of the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({
    example: 'APL-IP15P-128',
    description: 'SKU code of the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ example: 10, description: 'Minimum stock quantity' })
  @IsNumber()
  @IsNotEmpty()
  minStock!: number;

  @ApiProperty({ example: 100, description: 'Maximum stock quantity' })
  @IsNumber()
  @IsNotEmpty()
  maxStock!: number;

  @ApiProperty({
    example: 54.4,
    description: 'Weight of the product',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({ example: 15, description: 'Cost price of the product' })
  @IsNumber()
  @IsNotEmpty()
  costPrice!: number;

  @ApiProperty({ example: 20, description: 'Selling price of the product' })
  @IsNumber()
  @IsNotEmpty()
  sellingPrice!: number;

  @ApiProperty({ description: 'Supplier of the product', required: false })
  @IsString()
  @IsOptional()
  supplier!: string;

  @ApiProperty({
    example:
      'https://www.amazon.com/Apple-iPhone-13-Pro-128GB/dp/B09LP7YLF9?th=1',
    description: 'Image URL of the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  imgUrl?: string;

  @ApiProperty({
    example: '2nd floor',
    description: 'Location of the product in the warehouse',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    example: '2024-03-12',
    description: 'Expiry date of the product',
    required: false,
    type: String,
    format: 'date',
  })
  @IsOptional()
  expiryDate?: Date;

  @ApiProperty({
    example: 'RZ9M9SXJ3QEF',
    description: 'Category ID of the product',
  })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;
}
