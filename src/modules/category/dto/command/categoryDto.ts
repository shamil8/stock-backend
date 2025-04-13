import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty({
    example: 'Transport',
    description: 'This category is used for names of transports category.',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'Description.',
    description:
      'This category is used for description of transports category.',
  })
  @IsString()
  description!: string;
}
