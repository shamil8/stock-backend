import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ClientStatusEnum } from '../../enums/client-status.enum';
import { ClientTypeEnum } from '../../enums/client-type.enum';

export class UpdateClientCommand {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the client',
  })
  @IsOptional()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  @IsString()
  userName?: string;

  @ApiProperty({
    required: false,
    example: 'example@test.com',
    description: 'The email of user',
  })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email?: string;

  @ApiProperty({
    example: '9077701002',
    description: 'The phone number of the client',
  })
  @IsOptional()
  @MinLength(9)
  @MaxLength(20)
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'dubai',
    description: 'The address of the client',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'DISTRIBUTOR',
    description: 'The type of the client',
  })
  @IsOptional()
  @IsString()
  type?: ClientTypeEnum;

  @ApiProperty({
    example: 'INACTIVE',
    description: 'The status of the client',
  })
  @IsOptional()
  @IsString()
  status?: ClientStatusEnum;

  @ApiProperty({
    example: 1,
    description: 'The credit limit of the client',
  })
  @IsOptional()
  @IsNumber()
  creditLimit?: number;

  @ApiProperty({
    example: 100,
    description: 'The current debt of the client',
    required: true,
  })
  @IsNumber()
  currentDebt!: number;

  @ApiProperty({
    example: 'This client will come after 2 months',
    description: 'Any description for the client',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
