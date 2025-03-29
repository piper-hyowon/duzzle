import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./DuksaeJump.css";
import { useWebSocket } from "../../../services/WebSocketContext";
import {
  ToastComponent,
  ToastProps,
  ToastType,
} from "../../../components/Toast";
import { DuksaeJumpProps } from "./DuksaeJump.types";

const DuksaeJump: React.FC<DuksaeJumpProps> = ({ logId, data }) => {
  const navigate = useNavigate();
  const {
    objectSpeed,
    objectMaxSpeed,
    speedIncreaseRate,
    speedIncreaseInterval,
    gameoverLimit,
    passingScore,
  } = data;

  const { socket, isConnected } = useWebSocket();
  const [speed, setSpeed] = useState(objectSpeed / 15);
  const [health, setHealth] = useState(Math.max(0, gameoverLimit || 0));
  const [jumping, setJumping] = useState(false);
  const [obstacleType, setObstacleType] = useState("tree");
  const [gameover, setGameover] = useState(false);
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [score, setScore] = useState(0); // score => distance 값
  const [isColliding, setIsColliding] = useState(false);
  const [canJump, setCanJump] = useState(true);
  const obstacleRef = useRef<HTMLDivElement>(null);
  const dinoRef = useRef<HTMLDivElement>(null);
  const gameInitialized = useRef(false);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  // 충돌 감지
  const detectCollision = () => {
    if (!obstacleRef.current || !dinoRef.current) return false;

    const dinoRect = dinoRef.current.getBoundingClientRect();
    const obstacleRect = obstacleRef.current.getBoundingClientRect();
    const buffer = 10;
    const isCollision =
      dinoRect.right - buffer > obstacleRect.left + buffer &&
      dinoRect.left + buffer < obstacleRect.right - buffer &&
      dinoRect.bottom - buffer > obstacleRect.top + buffer &&
      dinoRect.top + buffer < obstacleRect.bottom - buffer;

    return isCollision;
  };

  // 장애물 이동
  const moveObstacle = useCallback(() => {
    if (obstacleRef.current && !gameover) {
      const obstacle = obstacleRef.current;
      let obstacleX = obstacle.offsetLeft;
      if (obstacleX <= 0) {
        obstacleX = window.innerWidth;
      }

      obstacle.style.left = `${obstacleX - speed}px`;
    }
  }, [speed, gameover]);

  // 게임 루프 및 충돌 처리
  useEffect(() => {
    const gameLoopInterval = setInterval(() => {
      moveObstacle();
      if (!gameover && !isColliding && detectCollision()) {
        setIsColliding(true);
        setHealth((prevHealth) => {
          const newHealth = Math.max(0, prevHealth - 1);
          if (newHealth === 0) {
            setGameover(true);
            socket.emit("quest:duksae-jump:fail", {
              score,
              logId,
              gamePanelOffsetWidth: 550,
            });
          }
          return newHealth;
        });
        showToast("충돌!", ToastType.Error);
        setTimeout(() => {
          setIsColliding(false);
        }, 500);
      }
    }, 20);

    return () => clearInterval(gameLoopInterval);
  }, [
    moveObstacle,
    detectCollision,
    gameover,
    isColliding,
    socket,
    score,
    logId,
  ]);
  useEffect(() => {
    if (!isConnected) return;

    const handleConnect = () => {
      console.log("Socket.io 연결 성공", socket.id);
      socket.emit("quest:duksae-jump:start", {
        logId,
        gamePanelOffsetWidth: 550,
      });
    };

    console.log("Socket.io 연결 성공", socket.id);
    socket.emit("quest:duksae-jump:start", {
      logId,
      gamePanelOffsetWidth: 550,
    });

    const handleDisconnect = () => {
      console.log("Socket.io 연결이 끊겼습니다.");
    };

    const handleObject = (newObstacleType: string) => {
      console.log("새로운 장애물:", newObstacleType);
      setObstacleType(newObstacleType);
    };

    const handleSpeed = (newSpeed: number) => {
      console.log("새로운 속도:", newSpeed);
      setSpeed(newSpeed);
    };

    const handleHealth = (remainingHealth: number) => {
      console.log("남은 목숨:", remainingHealth);
      setHealth(remainingHealth);
      showToast(
        `Health: ${new Array(remainingHealth).fill("❤️").join("")}`,
        ToastType.Warning
      );
    };

    const handleGameover = (finalScore: number) => {
      console.log("게임 오버, 최종 점수:", finalScore);
      setGameover(true);
      showToast(`Game Over! Total Score: ${finalScore} m`, ToastType.Error);
    };

    const handleResult = (resultData: { result: boolean; score: number }) => {
      console.log("게임 최종 결과:", resultData);
      setGameover(true);
      showToast(
        `${resultData.score}`,
        resultData.result ? ToastType.Success : ToastType.Error
      );
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("object", handleObject);
    socket.on("speed", handleSpeed);
    socket.on("health", handleHealth);
    socket.on("gameover", handleGameover);
    socket.on("result", handleResult);

    const speedInterval = setInterval(() => {
      if (!gameover) {
        setSpeed((prevSpeed) =>
          Math.min(prevSpeed * speedIncreaseRate, objectMaxSpeed)
        );
      }
    }, speedIncreaseInterval);

    const scoreInterval = setInterval(() => {
      if (!gameover) {
        setScore((prevScore) => {
          const newScore = prevScore + 1000 / speed;
          console.log("Score update:", {
            prevScore,
            newScore,
            speed,
            gameover,
          });
          return newScore;
        });
      }
    }, 100);

    return () => {
      socket.off("object");
      socket.off("speed");
      socket.off("health");
      socket.off("gameover");
      socket.off("result");
      clearInterval(speedInterval);
      clearInterval(scoreInterval);
    };
  }, [isConnected, socket, logId, gameover]);

  useEffect(() => {
    if (gameover) {
      if (score >= passingScore) {
        console.log("게임 종료 - 성공 조건 충족");
        socket.emit(
          "quest:duksae-jump:success",
          { score, logId, gamePanelOffsetWidth: 550 },
          () => {
            console.log("Success 메시지");
          }
        );
      } else {
        console.log("게임 종료 - 실패 조건 충족");
        socket.emit(
          "quest:duksae-jump:fail",
          { score, logId, gamePanelOffsetWidth: 550 },
          () => {
            console.log("Fail 메시지");
          }
        );
      }
    }
  }, [gameover, score, passingScore, logId, socket]);

  useEffect(() => {
    const handleJump = (event: KeyboardEvent | TouchEvent) => {
      const isTouchEvent = event.type === "touchstart";
      const isSpaceKey =
        !isTouchEvent && (event as KeyboardEvent).code === "Space";

      if ((isTouchEvent || isSpaceKey) && canJump && !gameover) {
        setJumping(true);
        setCanJump(false);

        const jumpDuration = 320;

        setTimeout(() => {
          setJumping(false);
          // setCanJump(true);
        }, jumpDuration);

        setTimeout(() => {
          setCanJump(true);
        }, jumpDuration + 100);
      }
    };

    window.addEventListener("keydown", handleJump);
    window.addEventListener("touchstart", handleJump);

    return () => {
      window.removeEventListener("keydown", handleJump);
      window.removeEventListener("touchstart", handleJump);
    };
  }, [jumping, gameover, canJump]);

  const handleResultPageNavigation = () => {
    navigate(score >= passingScore ? "/questsuccess" : "/questfail");
  };

  return (
    <div className="QuestJump">
      <div className="info">
        <p className="info_t">{passingScore}m를 달성하세요!</p>
      </div>
      <div className="game-panel">
        <span className="heart1">{new Array(health).fill("💛").join("")}</span>
        <span className="heart2"> {score.toFixed(2)} m</span>{" "}
        <div className={`dino ${jumping ? "jump" : ""}`} ref={dinoRef} />
        <div className={`obstacle ${obstacleType}`} ref={obstacleRef} />
      </div>
      <div className="info2">{/* <p>속도: {speed.toFixed(2)}</p> */}</div>

      {gameover && (
        <div className="score">
          <div id="distance1">Total Distance:</div>
          <div id="distance2">{score.toFixed(2)} m</div>
          <button
            className="restart4"
            id="restart4"
            onClick={handleResultPageNavigation}
          >
            결과 확인
          </button>
        </div>
      )}
      {toast && <ToastComponent message={toast.message} type={toast.type} />}
    </div>
  );
};

export default DuksaeJump;
