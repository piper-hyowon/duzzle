export type AcidRainQuestData = {
  dropIntervalMs: number;
  dropDistance: number; //  dropIntervalMs 밀리초마다 dropDistance 거리만큼 낙하 (dropDistance = 기존 speed)
  newWordIntervalMs: number; // 새 단어가 추가 되는 간격  (기존 delay)
  gameoverLimit: number; // 바닥에 떨어진 단어 최대 허용 개수
  passingScore: number; // 성공 컷 점수 (이상)
};

export interface WordProps {
  word: string;
  x: number;
  y: number;
}

export interface WordInstance {
  word: string;
  x: number;
  y: number;
  interval: NodeJS.Timeout;
}

export interface AcidRainProps {
  logId: number;
  data: AcidRainQuestData;
}

const AcidRainPrefix: string = "quest:acid-rain";

export const CORRECT_ANSWER_POINTS: number = 1;
export const WRONG_ANSWER_PENALTY: number = 1;
export const MISSING_ANSWER_PENALTY: number = 0.5;

export const AcidRainEventName = {
  // 클라이언트 발신 메시지
  Outbound: {
    Start: [AcidRainPrefix, "start"].join(":"),
    Answer: [AcidRainPrefix, "answer"].join(":"),
  },

  // 클라이언트 수신 메시지
  Inbound: {
    Word: "word",
    Hit: "hit",
    Miss: "miss",
    Wrong: "wrong",
    Score: "score",
    GameOver: "gameover",
    Result: "result",
  },
};
