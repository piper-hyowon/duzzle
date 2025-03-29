const AcidRainPrefix: string = 'quest:acid-rain';

export const CORRECT_ANSWER_POINTS: number = 1;
export const WRONG_ANSWER_PENALTY: number = 1;
export const MISSING_ANSWER_PENALTY: number = 0.5;

export const AcidRainMessagePattern = {
  // 서버 수신 메시지
  Inbound: {
    Start: [AcidRainPrefix, 'start'].join(':'),
    Answer: [AcidRainPrefix, 'answer'].join(':'),
  },

  // 서버 발신 메시지
  Outbound: {
    Word: 'word',
    Hit: 'hit',
    Miss: 'miss',
    Wrong: 'wrong',
    Score: 'score',
    GameOver: 'gameover',
    Result: 'result',
  },
};
