import { RedisKey } from 'src/module/cache/enum/cache.enum';

export class StartAcidRainMessageBody {
  logId: number;
  gamePanelOffsetHeight: number;
}

export class AnswerMessageBody {
  answer: string;
}

export type AcidRainQuestData = {
  dropIntervalMs: number;
  dropDistance: number; //  dropIntervalMs 밀리초마다 dropDistance 거리만큼 낙하 (dropDistance = 기존 speed)
  newWordIntervalMs: number; // 새 단어가 추가 되는 간격  (기존 delay)
  gameoverLimit: number; // 바닥에 떨어진 단어 최대 허용 개수
  passingScore: number; // 성공 컷 점수 (이상)
};

export class AcidRain {
  scoreKey: string;

  constructor(logId: number, clientId: string, userId: number | null) {
    this.scoreKey = [
      RedisKey.AcidRainScore,
      'logId',
      logId,
      'clientId',
      clientId,
      'userId',
      userId,
    ].join(':');
  }

  static getWordKey(clientId: string, word: string): string {
    return [clientId, word].join(':');
  }

  static getLastWordKey(clientId: string): string {
    return [clientId, 'last'].join(':');
  }

  static getPassingScoreKey(clientId: string): string {
    return [clientId, 'passing'].join(':');
  }
}
