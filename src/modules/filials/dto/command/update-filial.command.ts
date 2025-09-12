import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { FilialType } from '../../enums/filial.enum';

export class UpdateFilialCommand {
  @ApiProperty({
    example: 'Filial 3',
    description: 'The name that you want to replace',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: FilialType.WAREHOUSE,
    description: 'The type of filial',
  })
  @IsOptional()
  @IsString()
  type?: FilialType;

  @ApiProperty({
    example: 'Rudaki street',
    description: 'The address of filial',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'Dushanbe',
    description: 'The city of filial',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    example: 'SA123DWW',
    description: 'The id of manager',
  })
  @IsOptional()
  @IsString()
  manager?: string;
}
