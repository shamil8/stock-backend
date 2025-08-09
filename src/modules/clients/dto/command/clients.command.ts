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

import { ClientTypeEnum } from '../../enums/client-type.enum';

export class ClientsCommand {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the client',
  })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  @IsString()
  userName!: string;

  @ApiProperty({
    required: true,
    example: 'example@test.com',
    description: 'The email of user',
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email!: string;

  @ApiProperty({
    example: '9077701002',
    description: 'The phone number of the client',
  })
  @MinLength(9)
  @MaxLength(20)
  @IsString()
  phone!: string;

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
  @IsString()
  type!: ClientTypeEnum;

  @ApiProperty({
    example: 1,
    description: 'The credit limit of the client',
    required: true,
  })
  @IsNumber()
  creditLimit!: number;

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
