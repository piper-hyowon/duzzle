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

const DuksaeJump: React.FC<DuksaeJumpProps> = ({ data }) => {
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
  const [score, setScore] = useState(0);
  const [isColliding, setIsColliding] = useState(false);
  const [canJump, setCanJump] = useState(true);
  const obstacleRef = useRef<HTMLDivElement>(null);
  const dinoRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  // Socket Score Handling
  useEffect(() => {
    if (!isConnected) {
      console.warn("Socket not connected - score tracking disabled");
      return;
    }

    const handleScore = (newScore: number) => {
      setScore((prevScore) => {
        const updatedScore = newScore > prevScore ? newScore : prevScore;
        return updatedScore;
      });
    };

    socket.on("score", handleScore);

    return () => {
      socket.off("score", handleScore);
    };
  }, [isConnected, socket, score, speed, gameover]);

  // Speed and Game Mechanics
  useEffect(() => {
    if (!isConnected || gameover) return;

    const speedInterval = setInterval(() => {
      setSpeed((prevSpeed) =>
        Math.min(prevSpeed * speedIncreaseRate, objectMaxSpeed / 15)
      );
    }, speedIncreaseInterval);

    return () => clearInterval(speedInterval);
  }, [
    isConnected,
    gameover,
    speedIncreaseRate,
    objectMaxSpeed,
    speedIncreaseInterval,
  ]);

  useEffect(() => {
    if (gameover) return;

    const scoreInterval = setInterval(() => {
      setScore((prevScore) => {
        const newScore = prevScore + 1000 / (speed || 1);

        return newScore;
      });
    }, 100);

    return () => clearInterval(scoreInterval);
  }, [speed, gameover]);

  // Collision Detection
  const detectCollision = () => {
    if (!obstacleRef.current || !dinoRef.current) return false;

    const dinoRect = dinoRef.current.getBoundingClientRect();
    const obstacleRect = obstacleRef.current.getBoundingClientRect();
    const buffer = 10;
    return (
      dinoRect.right - buffer > obstacleRect.left + buffer &&
      dinoRect.left + buffer < obstacleRect.right - buffer &&
      dinoRect.bottom - buffer > obstacleRect.top + buffer &&
      dinoRect.top + buffer < obstacleRect.bottom - buffer
    );
  };

  // Obstacle Movement
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

  // Game Loop and Collision Handling
  useEffect(() => {
    const gameLoopInterval = setInterval(() => {
      moveObstacle();
      if (!gameover && !isColliding && detectCollision()) {
        setIsColliding(true);
        setHealth((prevHealth) => {
          const newHealth = Math.max(0, prevHealth - 1);
          if (newHealth === 0) {
            setGameover(true);
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
  }, [moveObstacle, detectCollision, gameover, isColliding, showToast]);

  // Socket Event Handling
  useEffect(() => {
    if (!isConnected) return;

    const handleConnect = () => {
      socket.emit("quest:duksae-jump:start", {
        gamePanelOffsetWidth: 550,
      });
    };

    const handleObject = (newObstacleType: string) => {
      setObstacleType(newObstacleType);
    };

    const handleSpeed = (newSpeed: number) => {
      setSpeed(newSpeed / 15);
    };

    const handleHealth = (remainingHealth: number) => {
      setHealth(remainingHealth);
      showToast(
        `Health: ${new Array(remainingHealth).fill("❤️").join("")}`,
        ToastType.Warning
      );
    };

    const handleGameover = (finalScore: number) => {
      setGameover(true);
      showToast(`Game Over! Total Score: ${finalScore} m`, ToastType.Error);
    };

    const handleResult = (resultData: { result: boolean; score: number }) => {
      setGameover(true);
      showToast(
        `${resultData.score}`,
        resultData.result ? ToastType.Success : ToastType.Error
      );
    };

    socket.on("connect", handleConnect);
    socket.on("object", handleObject);
    socket.on("speed", handleSpeed);
    socket.on("health", handleHealth);
    socket.on("gameover", handleGameover);
    socket.on("result", handleResult);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("object", handleObject);
      socket.off("speed", handleSpeed);
      socket.off("health", handleHealth);
      socket.off("gameover", handleGameover);
      socket.off("result", handleResult);
    };
  }, [isConnected, socket, showToast]);

  // Game Termination
  useEffect(() => {
    if (!gameover) return;

    const finalScore = score;
    if (finalScore >= passingScore) {
      socket.emit("quest:duksae-jump:success", {
        score: finalScore,
        gamePanelOffsetWidth: 550,
      });
    } else {
      socket.emit("quest:duksae-jump:fail", {
        score: finalScore,
        gamePanelOffsetWidth: 550,
      });
    }
  }, [gameover, score, passingScore, socket]);

  // Jump Handling
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

  // Result Page Navigation
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
