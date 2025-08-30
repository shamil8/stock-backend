import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { AuthCommand } from '../../../auth/dto/command/auth.command';
import { UserRole } from '../../enums/user-role';

export class StoreUserCommand extends AuthCommand {
  @ApiProperty({ required: false, example: 'Shamil', description: 'User name' })
  @IsString()
  @MaxLength(128)
  @MinLength(2)
  firstName?: string;

  @ApiProperty({
    required: false,
    example: 'Qurbonov',
    description: 'User last name',
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  @MaxLength(128)
  lastName?: string;

  @ApiProperty({
    example: 'sales',
    description: 'The department which worker works',
    required: true,
  })
  @IsString()
  @IsOptional()
  department!: string;

  @ApiProperty({
    example: 'L5UJL3PITD05',
    description: 'The is of the filial',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  filialId!: string;

  @ApiProperty({
    example: UserRole.EMPLOYEE,
    description: 'User worker role',
  })
  @IsString()
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}
