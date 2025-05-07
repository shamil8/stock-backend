import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Transport',
    description: 'This category is used for names of transports category.',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'This category is about transports',
    description:
      'This category is used for description of transports category.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '',
  })
  @IsOptional()
  @IsString()
  parentId!: string | null;
}
