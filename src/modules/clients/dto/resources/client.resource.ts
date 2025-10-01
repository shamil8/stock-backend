import { ApiProperty } from '@nestjs/swagger';

import { ClientTypeEnum } from '../../enums/client-type.enum';

export class ClientsResource {
  @ApiProperty({ description: 'Client ID' })
  id!: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the client',
  })
  userName!: string;

  @ApiProperty({
    required: true,
    example: 'example@test.com',
    description: 'The email of user',
  })
  email!: string;

  @ApiProperty({
    example: '9077701002',
    description: 'The phone number of the client',
  })
  phone!: string;

  @ApiProperty({
    example: 'dubai',
    description: 'The address of the client',
  })
  address?: string;

  @ApiProperty({
    example: 'DISTRIBUTOR',
    description: 'The type of the client',
  })
  type!: ClientTypeEnum;

  @ApiProperty({
    example: 1,
    description: 'The credit limit of the client',
    required: true,
  })
  creditLimit?: number;

  @ApiProperty({
    example: 100,
    description: 'The current debt of the client',
    required: true,
  })
  currentDebt?: number;

  @ApiProperty({
    example: 12,
    description: 'The total purchases of the client',
    required: true,
  })
  totalPurchases!: number;

  @ApiProperty({
    example: new Date(),
    description: 'The date of the last purchase',
    required: true,
  })
  lastPurchase?: Date;

  @ApiProperty({
    example: 'This client will come after 2 months',
    description: 'Any description for the client',
  })
  notes?: string;
}
