export type DuksaeJumpQuestData = {
  objectSpeed: number; // 덕새 초기 속도 (값이 작을 수록 빠름)
  objectMaxSpeed: number; // 덕새 최대 속도
  speedIncreaseRate: number; // 덕새 속도 증가율
  speedIncreaseInterval: number; // 덕새 속도 증가 간격 (밀리초)
  gameoverLimit: number; // 부딪힌 장애물 최대 허용 개수
  passingScore: number; // 성공 점수 (달성 시, 게임 종료)
};

export interface DuksaeJumpProps {
  logId: number;
  data: DuksaeJumpQuestData;
}
