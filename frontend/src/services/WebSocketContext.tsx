/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

type Listener = (...args: any[]) => void;

interface MockSocket {
  id: string;
  connected: boolean;
  on: (event: string, callback: Listener) => void;
  off: (event: string, callback?: Listener) => void;
  emit: (event: string, data?: any, callback?: () => void) => void;
  connect: () => void;
  disconnect: () => void;
}

interface WebSocketContextType {
  socket: MockSocket;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
  token?: string;
}

export const MockWebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  token,
}) => {
  const [connected, setConnected] = useState(false);

  // 이벤트 리스너 저장소
  const listenersRef = useRef<Record<string, Listener[]>>({});

  // 게임 상태 및 설정
  const stateRef = useRef({
    activeGame: null as "acid-rain" | "duksae-jump" | null,
    acidRain: {
      active: false,
      score: 0,
      missedCount: 0,
      remainingWords: [] as string[],
      activeWords: [] as string[],
      processedWords: [] as string[],
      settings: {
        gameoverLimit: 5,
        passingScore: 3,
        newWordIntervalMs: 1500,
      },
    },
    duksaeJump: {
      active: false,
      score: 0,
      speed: 5,
      health: 3,
      settings: {
        objectSpeed: 100,
        objectMaxSpeed: 500,
        speedIncreaseRate: 1.001,
        gameoverLimit: 3,
        passingScore: 9999,
        scoreUpdateInterval: 100, // ms
        scoreIncreaseRate: 5, // 기본 점수 증가량
      },
    },
  });

  // 타이머 관리
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  // 타이머 정리 함수
  const clearAllTimers = () => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];

    intervalsRef.current.forEach((id) => clearInterval(id));
    intervalsRef.current = [];
  };

  // 산성비 게임 단어 목록
  const acidRainWords = [
    "마스코트덕새",
    "섭섭이",
    "행운의까치",
    "독서카페",
    "차미리사선생",
    "자립자생자각",
    "교무처",
    "기획처",
    "학생인재개발처",
    "입학처",
    "국제처",
    "산학협력단",
  ];

  // 덕새 점프 게임 장애물
  const obstacles = ["tree", "cactus", "rock"];

  // 이벤트 발송 함수
  const emitEvent = (event: string, ...args: any[]) => {
    if (listenersRef.current[event]) {
      listenersRef.current[event].forEach((callback) => callback(...args));
    }
  };

  // 산성비 게임 시작
  const startAcidRainGame = () => {
    // 기존 타이머 정리
    clearAllTimers();

    // 상태 초기화
    stateRef.current.activeGame = "acid-rain";
    stateRef.current.acidRain = {
      ...stateRef.current.acidRain,
      active: true,
      score: 0,
      missedCount: 0,
      remainingWords: [...acidRainWords],
      activeWords: [],
      processedWords: [],
    };

    // 단어 생성 인터벌
    const wordInterval = setInterval(() => {
      if (!stateRef.current.acidRain.active) return;

      // 활성 단어가 많으면 생성 건너뛰기
      if (stateRef.current.acidRain.activeWords.length >= 5) return;

      // 단어 목록이 비었으면 다시 채우기
      if (stateRef.current.acidRain.remainingWords.length === 0) {
        stateRef.current.acidRain.remainingWords = [...acidRainWords];
      }

      // 단어 선택 및 발송
      const word = stateRef.current.acidRain.remainingWords.pop();
      if (word) {
        stateRef.current.acidRain.activeWords.push(word);
        emitEvent("word", word);
      }
    }, stateRef.current.acidRain.settings.newWordIntervalMs);

    intervalsRef.current.push(wordInterval);
  };

  // 덕새 점프 게임 시작
  const startDuksaeJumpGame = () => {
    // 기존 타이머 정리
    clearAllTimers();

    // 상태 초기화
    stateRef.current.activeGame = "duksae-jump";
    stateRef.current.duksaeJump = {
      ...stateRef.current.duksaeJump,
      active: true,
      score: 0,
      speed: stateRef.current.duksaeJump.settings.objectSpeed,
      health: stateRef.current.duksaeJump.settings.gameoverLimit,
    };

    // 초기 건강, 속도 설정
    emitEvent("health", stateRef.current.duksaeJump.health);
    emitEvent("speed", stateRef.current.duksaeJump.speed);

    // 첫 장애물 생성
    emitEvent(
      "object",
      obstacles[Math.floor(Math.random() * obstacles.length)]
    );

    // 주기적으로 장애물 생성
    const obstacleInterval = setInterval(() => {
      if (!stateRef.current.duksaeJump.active) return;

      const obstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
      emitEvent("object", obstacle);
    }, 2000);

    // 주기적으로 속도 증가
    const speedInterval = setInterval(() => {
      if (!stateRef.current.duksaeJump.active) return;

      const newSpeed = Math.min(
        stateRef.current.duksaeJump.speed *
          stateRef.current.duksaeJump.settings.speedIncreaseRate,
        stateRef.current.duksaeJump.settings.objectMaxSpeed
      );

      stateRef.current.duksaeJump.speed = newSpeed;
      emitEvent("speed", newSpeed);
    }, 3000);

    const scoreInterval = setInterval(() => {
      if (!stateRef.current.duksaeJump.active) return;

      // 점수 증가 (속도에 비례하여)
      const baseIncrease =
        stateRef.current.duksaeJump.settings.scoreIncreaseRate;
      const speedFactor =
        stateRef.current.duksaeJump.speed /
        stateRef.current.duksaeJump.settings.objectSpeed;
      const scoreIncrease = baseIncrease * speedFactor;

      stateRef.current.duksaeJump.score += scoreIncrease;
      const currentScore = stateRef.current.duksaeJump.score;

      // 점수 이벤트 발생 (소수점 둘째 자리까지 표시)
      emitEvent("score", parseFloat(currentScore.toFixed(2)));
      // ...
    }, stateRef.current.duksaeJump.settings.scoreUpdateInterval);

    intervalsRef.current.push(obstacleInterval, speedInterval, scoreInterval);
  };

  // 게임 종료
  const endGame = (score: number, success: boolean = false) => {
    const activeGame = stateRef.current.activeGame;

    // 게임 상태 비활성화
    if (activeGame === "acid-rain") {
      stateRef.current.acidRain.active = false;
    } else if (activeGame === "duksae-jump") {
      stateRef.current.duksaeJump.active = false;
    }

    // 게임오버 이벤트 발생 (약간의 지연)
    const timeoutId = setTimeout(() => {
      emitEvent("gameover", score);

      // 결과 이벤트 발생 (추가 지연)
      const resultTimeoutId = setTimeout(() => {
        let isSuccess = success;

        // 게임 타입에 따른 성공 여부 판단
        if (activeGame === "acid-rain") {
          const passingScore = stateRef.current.acidRain.settings.passingScore;
          isSuccess = success || score >= passingScore;
        } else if (activeGame === "duksae-jump") {
          const passingScore =
            stateRef.current.duksaeJump.settings.passingScore;
          isSuccess = success || score >= passingScore;
        }

        emitEvent("result", { result: isSuccess, score });
      }, 100);

      timeoutsRef.current.push(resultTimeoutId);
    }, 100);

    timeoutsRef.current.push(timeoutId);
  };

  // 가짜 소켓 객체
  const mockSocket: MockSocket = {
    id: `mock-${Math.random().toString(36).slice(2, 9)}`,
    connected,

    on: (event, callback) => {
      const listeners = listenersRef.current[event] || [];
      listenersRef.current[event] = [...listeners, callback];
    },

    off: (event, callback) => {
      if (callback) {
        listenersRef.current[event] = (
          listenersRef.current[event] || []
        ).filter((cb) => cb !== callback);
      } else {
        listenersRef.current[event] = [];
      }
    },

    emit: (event, data, callback) => {
      // 산성비 게임 시작
      if (event === "quest:acid-rain:start") {
        setConnected(true);
        const timeoutId = setTimeout(() => {
          emitEvent("connect");
          startAcidRainGame();
        }, 500);
        timeoutsRef.current.push(timeoutId);
      }

      // 덕새 점프 게임 시작
      if (event === "quest:duksae-jump:start") {
        setConnected(true);
        const timeoutId = setTimeout(() => {
          emitEvent("connect");
          startDuksaeJumpGame();
        }, 500);
        timeoutsRef.current.push(timeoutId);
      }

      // 산성비 게임 - 유저 답변 처리
      if (event === "quest:acid-rain:answer" && data?.answer) {
        const answer = data.answer;
        const activeWords = stateRef.current.acidRain.activeWords;

        if (activeWords.includes(answer)) {
          // 정답 처리
          stateRef.current.acidRain.activeWords = activeWords.filter(
            (w) => w !== answer
          );
          stateRef.current.acidRain.processedWords.push(answer);
          stateRef.current.acidRain.score += 1;

          emitEvent("hit", answer);
          emitEvent("score", stateRef.current.acidRain.score);

          // 성공 조건 체크
          if (
            stateRef.current.acidRain.score >=
            stateRef.current.acidRain.settings.passingScore
          ) {
            endGame(stateRef.current.acidRain.score, true);
          }
        } else {
          // 오답 처리
          stateRef.current.acidRain.score = Math.max(
            0,
            stateRef.current.acidRain.score - 1
          );
          emitEvent("wrong");
          emitEvent("score", stateRef.current.acidRain.score);
        }
      }

      // 산성비 게임 - 놓친 단어 처리
      if (event === "quest:acid-rain:miss" && data?.word) {
        const word = data.word;
        const activeWords = stateRef.current.acidRain.activeWords;
        const processedWords = stateRef.current.acidRain.processedWords;

        if (activeWords.includes(word) && !processedWords.includes(word)) {
          // 단어 목록에서 제거
          stateRef.current.acidRain.activeWords = activeWords.filter(
            (w) => w !== word
          );
          stateRef.current.acidRain.processedWords.push(word);

          // 놓친 횟수 증가 및 점수 감소
          stateRef.current.acidRain.missedCount += 1;
          stateRef.current.acidRain.score = Math.max(
            0,
            stateRef.current.acidRain.score - 0.5
          );

          emitEvent("miss", {
            word,
            count: stateRef.current.acidRain.missedCount,
          });
          emitEvent("score", stateRef.current.acidRain.score);

          // 실패 조건 체크
          if (
            stateRef.current.acidRain.missedCount >=
            stateRef.current.acidRain.settings.gameoverLimit
          ) {
            endGame(stateRef.current.acidRain.score, false);
          }
        }
      }

      // 덕새 점프 게임 - 성공/실패 처리
      if (event === "quest:duksae-jump:success") {
        endGame(data?.score || stateRef.current.duksaeJump.score, true);
        if (callback) callback();
      }

      if (event === "quest:duksae-jump:fail") {
        endGame(data?.score || stateRef.current.duksaeJump.score, false);
        if (callback) callback();
      }
    },
    connect: () => {
      setConnected(true);
      const timeoutId = setTimeout(() => {
        emitEvent("connect");
      }, 500);
      timeoutsRef.current.push(timeoutId);
    },
    disconnect: () => {
      setConnected(false);
      clearAllTimers();
      emitEvent("disconnect");
    },
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{ socket: mockSocket, isConnected: connected }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const WebSocketProvider = MockWebSocketProvider;
