import { Injectable } from '@nestjs/common';
import { MailgunService } from 'nestjs-mailgun';
import { MailTemplate } from '../repository/enum/mail.enum';

@Injectable()
export class MailService {
  private readonly domain: string = 'duksung-kkureogi.info';

  constructor(private mailgunService: MailgunService) {}

  async sendMail(to: string, template: MailTemplate, mailData?: any) {
    await this.mailgunService.createEmail(this.domain, {
      to,
      template,
      'h:X-Mailgun-Variables': JSON.stringify(mailData),
    });
  }
}
