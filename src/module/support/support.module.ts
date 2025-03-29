import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/module/repository/repository.module';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';

@Module({
  imports: [RepositoryModule],
  controllers: [SupportController],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}
