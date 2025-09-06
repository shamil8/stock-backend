import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { PaymentMethod } from '../../enums/payment-method.enum';
import { TransactionStatus } from '../../enums/traansaction-status.enum';
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
  @IsNotEmpty()
  @IsString()
  paymentMethod!: PaymentMethod;
}
