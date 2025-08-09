import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeUserPasswordCommand {
  @ApiProperty({ example: 'password', description: 'Current Password' })
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;

  @ApiProperty({ example: 'Password', description: 'New Password' })
  @IsNotEmpty()
  @IsString()
  newPassword!: string;
}
