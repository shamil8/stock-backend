import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryCommand {
  @ApiProperty({
    example: 'Transport',
    description: 'This category is used for names of transports category.',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'This category is about transports',
    description:
      'This category is used for description of transports category.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '1',
    description: 'The id of parent of the category',
    required: false,
  })
  @IsOptional()
  parentId?: string;
}
