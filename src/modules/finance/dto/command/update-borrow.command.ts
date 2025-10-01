import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateBorrowCommand {
  @ApiProperty({
    example: 500,
    description: 'The amount of returning borrow',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount!: number;
}
