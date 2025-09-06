import { ApiProperty } from '@nestjs/swagger';
import {} from 'class-validator';

import { ProductStatus } from '../../enums/product-status.enum';

export class ProductStoreResource {
  @ApiProperty({ example: '5C65A38HDOT6', description: 'ID of the filial' })
  filialId!: string;

  @ApiProperty({ example: 'Filial 1', description: 'Name of the filial' })
  filialName!: string;

  @ApiProperty({ example: '123 Street', description: 'Address of the filial' })
  filialAddress!: string;

  @ApiProperty({
    example: 11,
    description: 'Count of the product in this filial',
  })
  count!: number;
}

export class ProductResource {
  @ApiProperty({ description: 'Name of the product' })
  name!: string;

  @ApiProperty({ description: 'Description of the product', required: false })
  description?: string;

  @ApiProperty({ description: 'Brand of the product', required: false })
  brand?: string;

  @ApiProperty({ description: 'SKU code of the product', required: false })
  sku?: string;

  @ApiProperty({ description: 'Minimum stock quantity' })
  minStock!: number;

  @ApiProperty({ description: 'Maximum stock quantity' })
  maxStock!: number;

  @ApiProperty({ description: 'Weight of the product', required: false })
  weight?: number;

  @ApiProperty({ description: 'Cost price of the product' })
  costPrice!: number;

  @ApiProperty({ description: 'Selling price of the product' })
  sellingPrice!: number;

  @ApiProperty({ description: 'Supplier of the product', required: false })
  supplier!: string;

  @ApiProperty({ description: 'Image URL of the product', required: false })
  imgUrl?: string;

  @ApiProperty({ description: 'Available count of the product' })
  count!: number;

  @ApiProperty({
    description: 'Location of the product in the warehouse',
    required: false,
  })
  location?: string;

  @ApiProperty({
    description: 'Expiry date of the product',
    required: false,
    type: String,
    format: 'date',
  })
  expiryDate?: Date;

  @ApiProperty({
    description: 'Status of the product',
    required: false,
    default: 'Out of stock',
  })
  status?: ProductStatus;

  @ApiProperty({ description: 'Category ID of the product' })
  categoryId!: string;

  @ApiProperty({
    description: 'The list of in what filial and how many (much) is product',
  })
  productStore?: ProductStoreResource[];
}
