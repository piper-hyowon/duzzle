export const AcidRainEventName = {
  Inbound: {
    Word: "word",
    Score: "score",
    Hit: "hit",
    Wrong: "wrong",
    GameOver: "gameover",
    Miss: "miss",
    Result: "result",
  },
  Outbound: {
    Start: "quest:acid-rain:start",
    Answer: "quest:acid-rain:answer",
    Success: "quest:acid-rain:success",
    Fail: "quest:acid-rain:fail",
    Miss: "quest:acid-rain:miss",
  },
} as const;

export interface WordProps {
  word: string;
  x: number;
  y: number;
}

export interface WordInstance {
  word: string;
  x: number;
  y: number;
  interval: number;
  timeout?: number;
  missTimeout?: number;
  processed?: boolean;
}

export interface AcidRainProps {
  data: {
    passingScore: number;
    gameoverLimit: number;
    dropIntervalMs: number;
    dropDistance: number;
  };
}

// 점수 관련 상수
export const CORRECT_ANSWER_POINTS = 1;
export const WRONG_ANSWER_PENALTY = 1;
export const MISSING_ANSWER_PENALTY = 0.5;
