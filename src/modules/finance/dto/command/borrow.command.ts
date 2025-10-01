import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  BorrowParty,
  BorrowsStatus,
  BorrowType,
} from '../../enums/borrows.enum';

export class BorrowCommand {
  @ApiProperty({
    example: BorrowType.BORROW,
    description: 'Type of action',
  })
  @IsNotEmpty()
  @IsEnum(BorrowType)
  type!: BorrowType;

  @ApiProperty({
    example: 11,
    description: 'Amount of borrow',
  })
  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @ApiProperty({
    example: 11,
    description: 'Profit of borrow',
  })
  @IsOptional()
  @IsNumber()
  profit?: number;

  @ApiProperty({
    example: BorrowParty.CLIENT,
    description: 'Party of action',
  })
  @IsNotEmpty()
  @IsEnum(BorrowParty)
  partyType!: BorrowParty;

  @IsString()
  @IsNotEmpty()
  partyName!: string;

  @ApiProperty({
    example: '2025-04-09',
    description: 'Date of returning borrow',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  returnDate?: Date;

  @ApiProperty({
    example: BorrowsStatus.ACTIVE,
    description: 'Status of borrow',
  })
  @IsNotEmpty()
  @IsEnum(BorrowsStatus)
  status!: BorrowsStatus;

  @ApiProperty({
    example: 'WASEW12',
    description: 'User ID',
  })
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of User',
  })
  @IsNotEmpty()
  @IsString()
  userName!: string;

  @ApiProperty({
    example: 'SWGYHDE',
    description: 'Invoice ID',
  })
  @IsNotEmpty()
  @IsString()
  invoiceId!: string;

  @ApiProperty({
    example: 'maybe returns tomorrow',
    description: 'Notes for borrow',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
