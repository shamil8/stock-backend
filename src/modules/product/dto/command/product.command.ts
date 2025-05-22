import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class ProductCommand {
  @ApiProperty({
    example: 'Iphone 6 pro max',
    description: 'Name of the product.',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'Smart phone Iphone 6 pro max 256gb l/la.',
    description: 'All information about the product.',
  })
  @IsString()
  description?: string;

  @ApiProperty({
    example: 243,
    description: 'The weight of the product (in term of gramm).',
    required: false,
  })
  @IsNumber()
  weight?: number;

  @ApiProperty({
    example: 1500,
    description: 'The price of the product (in term of USD).',
  })
  @IsNumber()
  price!: number;

  @ApiProperty({
    example:
      'https://www.google.com/search?sca_esv=fb8ace8cedc707a8&sxsrf=AHTn8zpOpaa323x21DNL-sx9KsdLUzzUEA:1743962938441&q=iphone+16+pro+max&udm=2&fbs=ABzOT_ALXLK7nhX51dCJFXZvftNljihIFR0bjYjZ2Ob11NWoDhmNR4s1JD1HRY6KzbHoVs50toPKAkqsSC60PyK493kqWy9BDH4BVurbV37fJZlncDuIrJD0HS4BNM2KW7ecBniI5nInxgR2rJGzm1qniQgkQylJitJyi9NrcrJ9ibJD_XXkCBFGPze9w8xCwT3e-uvusmXSonxkeOPpRKUaxw5nPhOuELS2nNQ-EO8Ud4tlkzryKcM&sa=X&ved=2ahUKEwjk2cmbgMSMAxXlU1UIHWtDPTIQtKgLegQIEhAB&biw=1470&bih=920&dpr=2#vhid=cI5KZ-xUN-rgVM&vssid=mosaic',
    description: 'The link of picture of the product.',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  imgUrl?: string;

  @ApiProperty({
    example: 11111,
    description: 'The count of the product.',
  })
  @IsNumber()
  count!: number;

  @ApiProperty({
    example: '4O14DVIXFY2Y',
    description: 'The id of the category.',
    required: false,
  })
  @IsString()
  categoryId!: string;
}
