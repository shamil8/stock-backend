import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductCommand {
  @ApiProperty({ description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Description of the product', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Brand of the product', required: false })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ description: 'SKU code of the product', required: false })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ description: 'Minimum stock quantity' })
  @IsNumber()
  @IsNotEmpty()
  minStock!: number;

  @ApiProperty({ description: 'Maximum stock quantity' })
  @IsNumber()
  @IsNotEmpty()
  maxStock!: number;

  @ApiProperty({ description: 'Weight of the product', required: false })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({ description: 'Cost price of the product' })
  @IsNumber()
  @IsNotEmpty()
  costPrice!: number;

  @ApiProperty({ description: 'Selling price of the product' })
  @IsNumber()
  @IsNotEmpty()
  sellingPrice!: number;

  @ApiProperty({ description: 'Supplier of the product', required: false })
  @IsString()
  @IsOptional()
  supplier!: string;

  @ApiProperty({ description: 'Image URL of the product', required: false })
  @IsString()
  @IsOptional()
  imgUrl?: string;

  @ApiProperty({
    description: 'Location of the product in the warehouse',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Expiry date of the product',
    required: false,
    type: String,
    format: 'date',
  })
  @IsOptional()
  expiryDate?: Date;

  @ApiProperty({
    description: 'Status of the product',
    required: false,
    default: 'Out of stock',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'Category ID of the product' })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;
}
