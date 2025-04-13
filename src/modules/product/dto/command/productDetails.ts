import { IsNumber, IsString } from 'class-validator';

export class ProductDetails {
  @IsString()
  name!: string;

  @IsNumber()
  weight?: number;

  @IsNumber()
  price!: number;

  @IsString()
  picture!: string;

  @IsNumber()
  count!: number;
}
