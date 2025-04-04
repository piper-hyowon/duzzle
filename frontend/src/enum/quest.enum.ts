export enum QuestType {
  SpeedQuiz = "SPEED_QUIZ",
  AcidRain = "ACID_RAIN",
  DuksaeJump = "DUKSAE_JUMP",
  PictureQuiz = "PICTURE_QUIZ",
  MusicQuiz = "MUSIC_QUIZ",
}


export interface StartQuestResponse {
  type: QuestType;
  timeLimit: number;
  quest: string;
}