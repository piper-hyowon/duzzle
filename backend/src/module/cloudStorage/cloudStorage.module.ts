import { Module } from '@nestjs/common';
import { CloudStorageController } from './cloudStorage.controller';
import { CloudStorageService } from './cloudStorage.service';

@Module({
  controllers: [CloudStorageController],
  providers: [CloudStorageService],
  exports: [CloudStorageService],
})
export class CloudStorageModule {}
