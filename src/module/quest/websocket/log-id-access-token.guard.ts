import { QuestRepositoryService } from './../../repository/service/quest.repository.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

import { LoginJwtPayload } from 'src/module/auth/dto/auth.dto';

@Injectable()
export class LogIdAccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly questRepositoryService: QuestRepositoryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const body = context.switchToWs().getData();
    this.validateBody(body);

    const accessToken =
      client.handshake.auth?.token?.split(' ')[1] ||
      client.handshake.auth?.token;

    // accessToken이 있는 경우 (일반 유저)
    if (accessToken !== 'null') {
      const decoded = this.validateAccessToken(accessToken);
      client.user = decoded;
    }

    await this.validateLogAndSetClientLog(client, body.logId, client?.user?.id);

    return true;
  }

  private validateBody(body: any): void {
    if (!body?.logId) {
      throw new WsException('Missing logId');
    }
    if (!body?.gamePanelOffsetHeight && !body?.gamePanelOffsetWidth) {
      throw new WsException('Missing gamePanelOffsetHeight');
    }
  }

  private validateAccessToken(accessToken: string): LoginJwtPayload {
    return this.jwtService.verify(accessToken);
  }

  private async validateLogAndSetClientLog(
    client: any,
    logId: number,
    userId?: number,
  ): Promise<void> {
    // userId가 있는 경우 (일반 유저)
    if (userId) {
      const log = await this.questRepositoryService.findLogByIdAndUser(
        logId,
        userId,
      );
      if (!log) {
        throw new WsException('Bad Request');
      }
      client.log = log;
    } else {
      // userId가 없는 경우 (게스트)
      const log = await this.questRepositoryService.findGuestLogById(logId);
      if (!log || !log?.isGuestUser) {
        throw new WsException('Bad Request');
      }
      client.log = log;
    }
  }
}
