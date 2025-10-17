import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { PaymentMethod } from '../../../finance/enums/payment-method.enum';

class InvoiceItemDto {
  @ApiProperty({ example: 'WD5RFMQLJJVD' })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ example: 2, description: 'Quantity of product' })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity!: number;

  @ApiProperty({ example: 50.0, description: 'discount' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  discount!: number;

  @ApiProperty({ example: 100.0, description: 'Total for this product' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  total!: number;
}

export class InvoiceCommand {
  @ApiProperty({
    type: [InvoiceItemDto],
    description: 'List of products in the invoice',
  })
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  @ArrayMinSize(1)
  items!: InvoiceItemDto[];

  @ApiProperty({ example: 'XJVAFEQZYROT', required: false })
  @IsOptional()
  @IsString()
  clientId?: string | null;

  @ApiProperty({ example: 100.0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  subtotal!: number;

  @ApiProperty({ example: 15.0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  taxRate!: number;

  @ApiProperty({ example: 15.0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  taxAmount!: number;

  @ApiProperty({ example: 10.0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  discountAmount!: number;

  @ApiProperty({ example: 105.0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  total!: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiProperty({ example: 'Thank you for your purchase!', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  borrow!: boolean;

  @ApiProperty({
    example: '2025-09-24',
    description: 'Date of returning borrow',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  returnDate?: Date;

  @ApiProperty({ example: 'Product out of stock', required: false })
  @IsOptional()
  @IsString()
  cancellationReason?: string;
}
