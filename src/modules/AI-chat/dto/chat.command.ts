import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatCommand {
  @ApiProperty({
    example: 'Hello!',
    description: 'The prompt you want to send to AI',
  })
  @IsNotEmpty()
  @IsString()
  massage!: string;
}
