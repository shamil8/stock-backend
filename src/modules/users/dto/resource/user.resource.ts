import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '../../entities/user.entity';
import { UserRole } from '../../enums/user-role';
import { UserBaseResource } from './user-base.resource';

export class UserResource extends UserBaseResource {
  static readonly select: (keyof UserEntity)[] = [];

  @ApiProperty({ required: false, example: 'Shamil', description: 'User name' })
  firstName?: string;

  @ApiProperty({
    required: false,
    example: 'Kurbonov',
    description: 'User last name',
  })
  lastName?: string;

  @ApiProperty({
    example: 'worker',
    description: 'The role of the user',
  })
  role: UserRole;

  constructor(entity: UserEntity) {
    super(entity);

    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
    this.role = entity.role;
  }
}
