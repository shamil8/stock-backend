import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { WorkersRoleEnum } from '../../enums/workers-role.enum';
import { WorkerStatusEnum } from '../../enums/workers-status.enum';

export class WorkersCommand {
  @ApiProperty({
    example: 'Salim Odilov',
    description: 'The name of the worker',
  })
  @MinLength(3)
  @MaxLength(20)
  @IsString()
  name!: string;

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
    example: '+992907701002',
    description: 'The phone number of the worker',
  })
  @MinLength(9)
  @MaxLength(13)
  @IsString()
  phone?: string;

  @ApiProperty({
    example: WorkersRoleEnum.WORKER,
    description: 'The role of the worker',
  })
  @IsOptional()
  @IsString()
  role?: WorkersRoleEnum;

  @ApiProperty({
    example: 'Mағозаи хуроквории Чорерон',
    description: 'The department where the worker works',
  })
  @IsString()
  department?: string;

  @ApiProperty({
    example: WorkerStatusEnum.ACTIVE,
    description: 'The status of the worker',
  })
  @IsOptional()
  @IsString()
  status?: WorkerStatusEnum;
}
