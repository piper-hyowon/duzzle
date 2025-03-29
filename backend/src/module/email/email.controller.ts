import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';

import { MailService } from './email.service';
import { WelcomeMailData } from 'src/types/mail-data';
import { SendMailRequest } from './dto/email.dto';
import { MailTemplate } from '../repository/enum/mail.enum';
import { ApiDescription } from 'src/decorator/api-description.decorator';

@Controller({
  path: 'email',
})
export class MailController {
  constructor(
    @Inject(MailService)
    private readonly mailService: MailService,
  ) {}

  @ApiDescription({
    tags: 'Tmp',
    summary: '가입 환영 메일 발송 테스트용',
  })
  @HttpCode(HttpStatus.OK)
  @Post('mail')
  async sendWelcomeMail(@Body() dto: SendMailRequest) {
    const mailData: WelcomeMailData = {
      email: dto.email,
    };

    await this.mailService.sendMail(dto.email, MailTemplate.Welcome, mailData);
  }
}
