import 'socket.io';
import { LoginJwtPayload } from 'src/module/auth/dto/auth.dto';
import { LogQuestEntity } from 'src/module/repository/entity/log-quest.entity';

declare module 'socket.io' {
  interface Socket {
    user?: LoginJwtPayload;
    log?: LogQuestEntity;
  }
}
