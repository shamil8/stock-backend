import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DateListQuery {
  @ApiProperty({
    example: '01-09-2025',
    required: false,
  })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiProperty({
    example: '20-09-2025',
    required: false,
  })
  @IsOptional()
  @IsString()
  to?: string;
}
