import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/module/repository/repository.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailModule } from '../email/email.module';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';

@Module({
  imports: [RepositoryModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenIdsStorage],
  exports: [AuthService],
})
export class AuthModule {}
