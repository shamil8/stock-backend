import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { FilialStatusEnum, FilialTypeEnum } from '../../enums/filial.enum';

export class FilialCommand {
  @ApiProperty({ example: 'Filial 1', description: 'Name of the filial' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ enum: FilialTypeEnum, description: 'Type of filial' })
  @IsEnum(FilialTypeEnum)
  type!: FilialTypeEnum;

  @ApiProperty({
    example: '123 Street',
    description: 'Address of filial',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Dushanbe', description: 'City of filial' })
  @IsString()
  city!: string;

  @ApiProperty({ example: 'Tajikistan', description: 'Country of filial' })
  @IsString()
  country!: string;

  @ApiProperty({ example: '+992 123 456 789', description: 'Phone number' })
  @IsString()
  phone!: string;

  @ApiProperty({
    example: 'filial@example.com',
    description: 'Email of filial',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  email?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Manager name',
    required: false,
  })
  @IsOptional()
  @IsString()
  manager?: string;

  @ApiProperty({ enum: FilialStatusEnum, description: 'Status of filial' })
  @IsEnum(FilialStatusEnum)
  status!: FilialStatusEnum;

  @ApiProperty({ example: '09:00 - 18:00', description: 'Opening hours' })
  @IsString()
  openingHours!: string;

  @ApiProperty({ example: 50, description: 'Capacity of filial', default: 0 })
  @IsInt()
  @IsOptional()
  capacity?: number;

  @ApiProperty({ example: 10, description: 'Current staff', default: 0 })
  @IsInt()
  @IsOptional()
  currentStaff?: number;
}
