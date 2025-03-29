import { RepositoryModule } from 'src/module/repository/repository.module';
import { Module } from '@nestjs/common';
import { QuestController } from './rest/quest.controller';
import { QuestService } from './quest.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { QuestForGuestController } from './rest/quest-for-guest.controller';
import { QuestAcidRainGateway } from './websocket/quest-acidrain.gateway';
import { WebSocketModule } from '../websocket/websocket.module';
import { QuestDemoController } from './rest/quest-demo.controller';
import { QuestDuksaeJumpGateWay } from './websocket/quest-duksaejump.gateway';

@Module({
  imports: [RepositoryModule, BlockchainModule, WebSocketModule],
  controllers: [QuestController, QuestForGuestController, QuestDemoController],
  providers: [QuestService, QuestAcidRainGateway, QuestDuksaeJumpGateWay],
  exports: [QuestService],
})
export class QuestModule {}
