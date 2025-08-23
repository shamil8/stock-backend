import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { UserRole } from '../../../users/enums/user-role';
import { WorkerStatusEnum } from '../../enums/workers-status.enum';

export class WorkersResource {
  @ApiProperty({
    example: 'FDS21',
    description: 'the id of the account',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  accountId!: string;

  @ApiProperty({
    example: 'Salim',
    description: 'The firstname of the worker',
  })
  firstName!: string;

  @ApiProperty({
    example: 'Odilov',
    description: 'The lastname of the worker',
  })
  lastName?: string;

  @ApiProperty({
    required: true,
    example: 'example@test.com',
    description: 'The email of the worker',
  })
  email!: string;

  @ApiProperty({
    example: '+992907701002',
    description: 'The phone number of the worker',
  })
  phone?: string;

  @ApiProperty({
    example: '123 Main St, City, State 12345',
    description: 'The address of the worker',
  })
  address?: string;

  @ApiProperty({
    example: 'Магозаи хуроквории Чорерон',
    description: 'The department where the worker works',
  })
  department?: string;

  @ApiProperty({
    example: 'Sales Manager',
    description: 'The position of the worker',
  })
  position?: string;

  @ApiProperty({
    example: UserRole.WORKER,
    description: 'The role of the worker',
    enum: UserRole,
  })
  role?: UserRole;

  @ApiProperty({
    example: 5000,
    description: 'The salary of the worker',
  })
  salary!: number;

  @ApiProperty({
    example: 10,
    description: 'The commission percentage of the worker',
  })
  commission!: number;

  @ApiProperty({
    example: WorkerStatusEnum.ACTIVE,
    description: 'The status of the worker',
    enum: WorkerStatusEnum,
  })
  status?: WorkerStatusEnum;

  @ApiProperty({
    example: 'Ali Valiyev',
    description: 'Manager of the worker',
  })
  manager?: string;

  @ApiProperty({
    example: ['Sales', 'Leadership', 'CRM', 'Negotiation'],
    description: 'Skills of the worker',
    type: [String],
  })
  skills?: string[];

  @ApiProperty({
    example: 'Top performer of the month',
    description: 'Additional notes about the worker',
  })
  notes?: string;

  @ApiProperty({
    example: 20000,
    description: 'Monthly sales target of the worker',
  })
  salesTarget!: number;
}
