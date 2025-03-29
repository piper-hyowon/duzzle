import { Http } from "../Http";

export enum QuestType {
  SpeedQuiz = "SPEED_QUIZ",
  AcidRain = "ACID_RAIN",
  DuksaeJump = "DUKSAE_JUMP",
  PictureQuiz = "PICTURE_QUIZ",
  MusicQuiz = "MUSIC_QUIZ",
}

export interface StartRandomQuestResponse {
  type: QuestType;
  timeLimit: number;
  quest: string;
  logId: number;
}

export interface GetResultRequest {
  logId: number;
  answer: string[];
}

// TODO: 예외처리 추가
export const QuestApis = {
  /**
   * 퀘스트 시작하기
   */
  startQuest: async (header): Promise<StartRandomQuestResponse> => {
    try {
      const response = await Http.post<{
        result: boolean;
        data: StartRandomQuestResponse;
      }>("/v1/quest/start", header);

      return response.data;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
  /**
   * 퀘스트 시작하기(비회원)
   */
  startForGuest: async (): Promise<StartRandomQuestResponse> => {
    try {
      const response = await Http.post<{
        result: boolean;
        data: StartRandomQuestResponse;
      }>("/v1/quest/guest/start");

      return response.data;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
  /**
   * 결과 제출하기
   */
  getResult: async (data: GetResultRequest, header) => {
    try {
      const response = await Http.post<{
        result: boolean;
        data: boolean;
      }>("/v1/quest/result", data, header);

      return response.data;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
  /**
   * 결과 제출하기(비회원)
   */
  getResultForGuest: async (data: GetResultRequest) => {
    try {
      const response = await Http.post<{
        result: boolean;
        data: boolean;
      }>("/v1/quest/guest/result", data);

      return response.data;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
};

// TODO: 개발용 API(실제 환경에서는 삭제)
export const QuestApisForTest = {
  /**
   * 퀘스트 시작하기
   * - 산성비만 나옴
   */
  startAcidRain: async (): Promise<StartRandomQuestResponse> => {
    try {
      const response = await Http.post<{
        result: boolean;
        data: StartRandomQuestResponse;
      }>("/v1/quest/demo/acidrain/start");

      return response.data;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
  /**
   * 퀘스트 시작하기
   * - 덕새점프만 나옴
   */
  startDuksaeJump: async (): Promise<StartRandomQuestResponse> => {
    try {
      const response = await Http.post<{
        result: boolean;
        data: StartRandomQuestResponse;
      }>("/v1/quest/demo/duksae-jump/start");

      return response.data;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
  /**
   * 퀘스트 시작하기
   * - 스피드 퀴즈만 나옴
   */
  startSpeedQuiz: async (): Promise<StartRandomQuestResponse> => {
    try {
      const response = await Http.post<{
        result: boolean;
        data: StartRandomQuestResponse;
      }>("/v1/quest/demo/speed-quiz/start");

      return response.data;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
  /**
   * 퀘스트 시작하기
   * - 음악 퀴즈만 나옴
   */
  startMusicQuiz: async (): Promise<StartRandomQuestResponse> => {
    try {
      const response = await Http.post<{
        result: boolean;
        data: StartRandomQuestResponse;
      }>("/v1/quest/demo/music-quiz/start");

      return response.data;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
  /**
   * 퀘스트 시작하기
   * - 그림퀴즈만 나옴
   */
  startPictureQuiz: async (): Promise<StartRandomQuestResponse> => {
    try {
      const response = await Http.post<{
        result: boolean;
        data: StartRandomQuestResponse;
      }>("/v1/quest/demo/picture-quiz/start");

      return response.data;
    } catch (error) {
      console.error(error?.response.data.code);
      console.error(error?.response?.data.message);
      throw error;
    }
  },
};
