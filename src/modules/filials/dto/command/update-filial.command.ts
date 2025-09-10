import { IsOptional, IsString } from 'class-validator';

import { FilialType } from '../../enums/filial.enum';

export class UpdateFilialCommand {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: FilialType;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  manager?: string;
}
