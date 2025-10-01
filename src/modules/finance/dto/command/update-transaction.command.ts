import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTransactionCommand {
  @ApiProperty({
    example: 'Purchase',
    description: 'Update a transaction category',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    example: 'Supplier transaction with Samsung',
    description: 'Update a transaction description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
