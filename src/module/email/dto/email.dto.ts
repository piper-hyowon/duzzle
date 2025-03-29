import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendMailRequest {
  @ApiProperty({ description: '이메일 받을 주소' })
  @IsEmail()
  email: string;
}
