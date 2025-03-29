import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Acid.css";
import {
  AcidRainEventName as Event,
  AcidRainProps,
  WordInstance,
  CORRECT_ANSWER_POINTS,
  WRONG_ANSWER_PENALTY,
  MISSING_ANSWER_PENALTY,
} from "./Acid.types";
import { useWebSocket } from "../../../services/WebSocketContext";
import { useNavigate } from "react-router-dom";
import {
  ToastComponent,
  ToastProps,
  ToastType,
} from "../../../components/Toast";

const Word = ({ word, x, y }) => {
  return (
    <div className="word" style={{ left: x, top: y }}>
      {word}
    </div>
  );
};

const Acid: React.FC<AcidRainProps> = ({ logId, data }) => {
  const nav = useNavigate();
  const { dropIntervalMs, dropDistance, gameoverLimit, passingScore } = data;

  // 글자 복사 방지
  document.onselectstart = function () {
    return false;
  };

  const [waitWords, setWaitWords] = useState<string[]>([]);
  const [activeWordObjs, setActiveWordObjs] = useState<WordInstance[]>([]);
  const [score, setScore] = useState(0);
  const [failed, setFailed] = useState(0);
  const [gameover, setGameover] = useState(false);
  const [isSucceeded, setIsSucceeded] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputRef = useRef<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gamePanelRef = useRef<any>();
  const { socket } = useWebSocket();
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const handleHit = useCallback(
    // 맞춘단어는 active word 에서 제거
    (hitWord: string) => {
      const index = activeWordObjs.findIndex(
        (element) => element.word === hitWord
      );
      if (index !== -1) {
        clearInterval(activeWordObjs[index].interval);
        setActiveWordObjs((prev) => prev.filter((_, i) => i !== index));
      }
      showToast(`+ ${CORRECT_ANSWER_POINTS}점`, ToastType.Success);
    },
    [activeWordObjs, showToast]
  );

  const handleWrong = useCallback(() => {
    showToast(`- ${WRONG_ANSWER_PENALTY}점`, ToastType.Error);
  }, [showToast]);

  useEffect(() => {
    const handleNewWord = (newWord: string) => {
      console.timeLog("game", `new word: ${newWord}`);
      setWaitWords((prev) => [...prev, newWord]);
    };

    const handleScore = (score: number) => {
      setScore(score);
    };

    const handleGameover = (score: number) => {
      console.timeLog("game", "gameover!!! ");
      setGameover(true);
      setScore(score);
      setActiveWordObjs([]);
      setIsSucceeded(false);
    };

    const handleMissedWord = (data: { word: string; count: number }) => {
      const { word, count } = data;
      setFailed(count);
      showToast(`- ${MISSING_ANSWER_PENALTY}점`, ToastType.Warning);

      console.log(
        `0.5 점 마이너스!! ${word} 놓쳤다고 판단, 지금까지 놓친 단어 수 = ${count}`
      );
    };

    const handleResult = (data: { result: boolean; score: number }) => {
      const { result, score } = data;
      setScore(score);
      console.timeLog("game", `최종 결과: result:${result}, score: ${score}`);
      setGameover(true);
      setActiveWordObjs([]);
      setIsSucceeded(result);
    };

    socket.on(Event.Inbound.Word, handleNewWord);
    socket.on(Event.Inbound.Score, handleScore);
    socket.on(Event.Inbound.Hit, handleHit);
    socket.on(Event.Inbound.Wrong, handleWrong);
    socket.on(Event.Inbound.GameOver, handleGameover);
    socket.on(Event.Inbound.Miss, handleMissedWord);
    socket.on(Event.Inbound.Result, handleResult);

    // 컴포넌트 언마운트 시 소켓 이벤트 리스너 정리
    return () => {
      socket.off(Event.Inbound.Word, handleNewWord);
      socket.off(Event.Inbound.Score, handleScore);
      socket.off(Event.Inbound.Hit, handleHit);
      socket.off(Event.Inbound.Wrong, handleWrong);
      socket.off(Event.Inbound.GameOver, handleGameover);
      socket.off(Event.Inbound.Miss, handleMissedWord);
      socket.off(Event.Inbound.Result, handleResult);
    };
  }, [handleHit, handleWrong, showToast, socket]);

  useEffect(() => {
    if (!gameover && !showHelp && socket) {
      inputRef.current?.focus();
      document.addEventListener("click", handleClick);
      const repaintInterval = setInterval(() => {
        repaint();
      }, dropIntervalMs);

      return () => {
        clearInterval(repaintInterval);
      };
    }
  }, [gameover, showHelp, waitWords, socket, dropIntervalMs]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket.io 연결 성공", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket.io 연결이 끊겼습니다.");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  useEffect(() => {
    if (waitWords.length !== 0) {
      dropWord();
    }
  }, [waitWords]);

  const dropWord = () => {
    const word = waitWords.shift()!;

    const boardElement = document.getElementById("board");
    const boardWidth = boardElement?.offsetWidth || 0;

    const maxWidth = 400;

    console.log("boardWidth:", boardWidth);

    const xOffset = (boardWidth - maxWidth) / 2;
    const xPosition = xOffset + Math.random() * Math.min(boardWidth, maxWidth);

    const wordInstance = {
      word,
      x: xPosition,
      y: 0,
      interval: setInterval(() => {
        setActiveWordObjs((prev) => {
          const updatedWords = prev.map((obj) =>
            obj.word === word ? { ...obj, y: obj.y + dropDistance } : obj
          );
          return updatedWords.filter(
            (obj) => obj.y < gamePanelRef.current.offsetHeight - 10
          );
        });
      }, dropIntervalMs),
    };

    setActiveWordObjs((prev) => [...prev, wordInstance]);
  };

  const repaint = () => {
    setActiveWordObjs(
      (prev) =>
        prev
          .map((wordObj) => {
            if (wordObj.y >= gamePanelRef.current.offsetHeight - 10) {
              clearInterval(wordObj.interval);
              return null;
            }
            return wordObj;
          })
          .filter(Boolean) as WordInstance[]
    );
  };

  const hitWord = (word: string) => {
    if (socket) {
      socket.emit(Event.Outbound.Answer, { answer: word });
      console.log(`서버 유저 입력 단어 전송: ${word}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) {
      return;
    }
    inputRef.current.focus();
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      hitWord(inputRef.current.value.trim());

      inputRef.current.value = "";
    }
  };

  const startGame = () => {
    setActiveWordObjs([]);
    setScore(0);
    setFailed(0);
    setGameover(false);
    setShowHelp(false);
    inputRef.current.focus();

    if (socket) {
      socket.connect();
      console.time("game");
      socket.emit(Event.Outbound.Start, {
        logId,
        gamePanelOffsetHeight: gamePanelRef.current.offsetHeight,
      });

      socket.on("exception", (data) => {
        console.error("Error from server:", data);
      });
    }
  };

  const showHelpScreen = () => {
    setShowHelp(true);
  };

  const handleClick = () => {
    if (!gameover && !showHelp) {
      inputRef.current?.focus();
    }
  };

  const handleResultPageNavigation = () => {
    if (isSucceeded) {
      nav("/questsuccess");
    } else {
      nav("/questfail");
    }
  };

  return (
    <div className="QuestAcid">
      <div className="container-fluid">
        <div ref={gamePanelRef} id="game-panel" className="container"></div>
        <div id="control-panel-frame">
          <div
            id="control-panel"
            className="col-md-5 align-content-center container"
          >
            <div>
              <label className="my-score">점수 : </label>
              <label className="my-score" id="score-1">
                {score}
              </label>
            </div>
            <div>
              <label className="my-score">실패 : </label>
              <label className="my-score" id="failed">
                {failed}
              </label>
            </div>
            <input type="text" ref={inputRef} onKeyDown={handleKeyDown} />
          </div>
        </div>
        <div id="board">
          {showHelp && (
            <div id="help-div">
              <div id="help-title">산성비 게임💧</div>
              <div id="de">
                💙HOW TO?
                <br />
                위에서 비처럼 떨어지는 단어가 <b>바닥에 닿기 전</b> 단어를{" "}
                <b>입력</b>하여 점수를 획득하세요.
                <br />
                <br />
                ✔️ 총 <b>{passingScore}단어</b> 이상을 입력하면 <b>성공</b>
                <br />
                ✔️ <b>없는 단어</b> 입력 시 점수가 차감됩니다. <br />
                ✔️ <b>{gameoverLimit}개</b>가 바닥에 떨어지면 게임은 종료!
                <br />
                ✔️ 게임이 종료되면 획득한 점수 공개 <br />
              </div>
              <button
                className="buttonstart"
                role="button"
                id="start"
                onClick={startGame}
              >
                게임 시작
              </button>
            </div>
          )}
          {gameover && !showHelp && (
            <div className="score">
              <div id="end-score">점수: {score}</div>
              <button
                className="restart"
                id="restart"
                onClick={handleResultPageNavigation}
              >
                결과 확인
              </button>
              {/* <button className="explain" onClick={showHelpScreen}>
              게임 설명
            </button> */}
            </div>
          )}
        </div>
        {activeWordObjs.map((wordObj, index) => (
          <Word key={index} word={wordObj.word} x={wordObj.x} y={wordObj.y} />
        ))}
        {toast && <ToastComponent message={toast.message} type={toast.type} />}
      </div>
    </div>
  );
};
export default Acid;
