import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { WorkerStatusEnum } from '../../enums/workers-status.enum';

export class WorkersCommand {
  @ApiProperty({
    example: 'FDS21',
    description: 'the id of the account',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  accountId!: string;

  @ApiProperty({
    example: '+992907701002',
    description: 'The phone number of the worker',
  })
  @IsOptional()
  @MinLength(9)
  @MaxLength(13)
  @IsString()
  phone?: string;

  @ApiProperty({
    example: '123 Main St, City, State 12345',
    description: 'The address of the worker',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'Sales Manager',
    description: 'The position of the worker',
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({
    example: 5000,
    description: 'The salary of the worker',
  })
  @IsNotEmpty()
  @IsNumber()
  salary!: number;

  @ApiProperty({
    example: 10,
    description: 'The commission percentage of the worker',
  })
  @IsNotEmpty()
  @IsNumber()
  commission!: number;

  @ApiProperty({
    example: WorkerStatusEnum.ACTIVE,
    description: 'The status of the worker',
  })
  @IsOptional()
  @IsEnum(WorkerStatusEnum)
  status?: WorkerStatusEnum;

  @ApiProperty({
    example: ['Sales', 'Leadership', 'CRM', 'Negotiation'],
    description: 'Skills of the worker',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiProperty({
    example: 'Top performer of the month',
    description: 'Additional notes about the worker',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    example: 20000,
    description: 'Monthly sales target of the worker',
  })
  @IsNotEmpty()
  @IsNumber()
  salesTarget!: number;
}
