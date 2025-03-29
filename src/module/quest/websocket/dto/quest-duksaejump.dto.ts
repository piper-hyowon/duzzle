import { RedisKey } from 'src/module/cache/enum/cache.enum';

export class StartDuksaeJumpMessageBody {
  logId: number;
  gamePanelOffsetWidth: number;
}

export class ScoreMessageBody {
  score: number;

  // log-id-access-token.guard 검증용 (삭제 예정)
  logId: number;
  gamePanelOffsetWidth: number;
}

export type DuksaeJumpQuestData = {
  objectSpeed: number;
  objectMaxSpeed: number;
  speedIncreaseRate: number;
  speedIncreaseInterval: number;
  gameoverLimit: number; // 부딪힌 장애물 최대 허용 개수
  passingScore: number; // 성공 점수 (달성 시, 게임 종료)
};

export class DuksaeJump {
  scoreKey: string;

  constructor(logId: number, clientId: string, userId: number | null) {
    this.scoreKey = [
      RedisKey.DuksaeJumpScore,
      'logId',
      logId,
      'clientId',
      clientId,
      'userId',
      userId,
    ].join(':');
  }

  static getHealthPointKey(clientId: string): string {
    return [clientId, 'health'].join(':');
  }

  static getPassingScoreKey(clientId: string): string {
    return [clientId, 'passing'].join(':');
  }
}
