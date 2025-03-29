import { Module } from '@nestjs/common';
import { MailgunModule } from 'nestjs-mailgun';
import { MailService } from './email.service';
import { MailController } from './email.controller';

@Module({
  imports: [
    MailgunModule.forAsyncRoot({
      useFactory: async () => ({
        username: process.env.MAILGUN_USERNAME,
        key: process.env.MAILGUN_KEY,
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
