import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaymentMethod } from '../../enums/payment-method.enum';

export class UpdateTransactionCommand {
  @ApiProperty({
    example: 'Purchase',
    description: 'Update a transaction category',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    example: 'Supplier transaction with Samsung',
    description: 'Update a transaction description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: PaymentMethod.CASH,
    description: 'Update a transaction payment method',
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  @IsString()
  paymentMethod?: string;
}
