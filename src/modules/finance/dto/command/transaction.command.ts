import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { PaymentMethod } from '../../enums/payment-method.enum';
import { TransactionType } from '../../enums/transaction-type.enum';

export class TransactionCommand {
  @ApiProperty({
    example: TransactionType.EXPENSE,
    description: 'The type of transaction',
  })
  @IsString()
  @IsNotEmpty()
  type!: TransactionType;

  @ApiProperty({
    example: 'utilities',
    description: 'The category of transaction',
  })
  @IsNotEmpty()
  @IsString()
  category!: string;

  @ApiProperty({
    example: 'Monthly electricity bill',
    description: 'The description of transaction',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    example: 1444,
    description: 'The amount of transaction',
  })
  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @ApiProperty({
    example: PaymentMethod.CASH,
    description: 'The method of payment',
  })
  @IsOptional()
  @IsString()
  paymentMethod?: PaymentMethod | null;

  @ApiProperty({ example: 500, required: false })
  @IsOptional()
  @IsNumber()
  profit?: number;
}
