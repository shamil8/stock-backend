import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductCommand {
  @ApiProperty({
    example: 'Iphone 16 pro max',
    description: 'Name of the product.',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Smartphone Iphone 16 pro max 256gb l/la.',
    description: 'All information about the product.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 241,
    description: 'The weight of the product (in term of gramm).',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty({
    example: 1499,
    description: 'The price of the product (in term of USD).',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    example:
      'https://www.google.com/search?sca_esv=fb8ace8cedc707a8&sxsrf=AHTn8zpOpaa323x21DNL-sx9KsdLUzzUEA:1743962938441&q=iphone+16+pro+max&udm=2&fbs=ABzOT_ALXLK7nhX51dCJFXZvftNljihIFR0bjYjZ2Ob11NWoDhmNR4s1JD1HRY6KzbHoVs50toPKAkqsSC60PyK493kqWy9BDH4BVurbV37fJZlncDuIrJD0HS4BNM2KW7ecBniI5nInxgR2rJGzm1qniQgkQylJitJyi9NrcrJ9ibJD_XXkCBFGPze9w8xCwT3e-uvusmXSonxkeOPpRKUaxw5nPhOuELS2nNQ-EO8Ud4tlkzryKcM&sa=X&ved=2ahUKEwjk2cmbgMSMAxXlU1UIHWtDPTIQtKgLegQIEhAB&biw=1470&bih=920&dpr=2#vhid=cI5KZ-xUN-rgVM&vssid=mosaic',
    description: 'The link of picture of the product.',
    required: false,
  })
  @IsOptional()
  @IsString()
  imgUrl?: string;

  @ApiProperty({
    example: 11111,
    description: 'The count of the product.',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  count?: number;
}
