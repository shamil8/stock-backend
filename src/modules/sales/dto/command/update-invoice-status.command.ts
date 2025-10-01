import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { InvoiceStatus } from '../../enums/invoice.enum';

export class UpdateInvoiceStatusCommand {
  @ApiProperty({
    example: InvoiceStatus.DRAFT,
    description: 'Update invoice status',
  })
  @IsNotEmpty()
  @IsEnum(InvoiceStatus)
  status!: InvoiceStatus;

  @ApiProperty({
    example: 'Client rejected',
    description: 'Rejection reason',
  })
  @IsOptional()
  @IsString()
  cancellationReason?: string;
}
