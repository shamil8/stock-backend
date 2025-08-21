import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AttendanceListQuery {
  @ApiProperty({
    example: '2025-04-21',
    description: 'Attendance date YYYY-MM-DD',
  })
  @IsOptional()
  @IsString()
  date?: string;
}
