import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CategoryCommand {
  @ApiProperty({
    example: 'Transport',
    description: 'This category is used for names of transports category.',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'This category is about transports',
    description:
      'This category is used for description of transports category.',
  })
  @IsString()
  description?: string;

  @ApiProperty({
    example: '1',
    description: 'The id of parent of the category',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  parentId!: string | null;
}
