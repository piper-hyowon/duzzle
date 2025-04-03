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

const Acid: React.FC<AcidRainProps> = ({ data }) => {
  const nav = useNavigate();
  const { dropIntervalMs, dropDistance, gameoverLimit, passingScore } = data;

  // 상태 관리
  const [waitWords, setWaitWords] = useState<string[]>([]);
  const [activeWordObjs, setActiveWordObjs] = useState<WordInstance[]>([]);
  const [score, setScore] = useState(0);
  const [failed, setFailed] = useState(0);
  const [gameover, setGameover] = useState(false);
  const [isSucceeded, setIsSucceeded] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [toast, setToast] = useState<ToastProps | null>(null);

  // 참조 관리
  const inputRef = useRef<HTMLInputElement>(null);
  const gamePanelRef = useRef<HTMLDivElement>(null);
  const { socket } = useWebSocket();

  // 이미 처리된 단어를 추적하기 위한 ref
  const processedWordsRef = useRef(new Set<string>());

  // 글자 복사 방지
  useEffect(() => {
    const originalSelectStart = document.onselectstart;
    document.onselectstart = function () {
      return false;
    };

    return () => {
      document.onselectstart = originalSelectStart;
    };
  }, []);

  // 토스트 메시지 표시
  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  // 단어 맞춤 처리
  const handleHit = useCallback(
    (hitWord: string) => {
      setActiveWordObjs((prev) => {
        const index = prev.findIndex((obj) => obj.word === hitWord);
        if (index !== -1) {
          clearInterval(prev[index].interval);
          return prev.filter((_, i) => i !== index);
        }
        return prev;
      });
      showToast(`+ ${CORRECT_ANSWER_POINTS}점`, ToastType.Success);
    },
    [showToast]
  );

  // 오답 처리
  const handleWrong = useCallback(() => {
    showToast(`- ${WRONG_ANSWER_PENALTY}점`, ToastType.Error);
  }, [showToast]);

  // 놓친 단어 처리
  const handleMissedWord = useCallback(
    (data: { word: string; count: number }) => {
      const { word, count } = data;
      setFailed(count);
      showToast(`- ${MISSING_ANSWER_PENALTY}점`, ToastType.Warning);

      // 이미 처리된 단어로 표시
      processedWordsRef.current.add(word);

      // 화면에서 단어 제거
      setActiveWordObjs((prev) => {
        const index = prev.findIndex((obj) => obj.word === word);
        if (index !== -1) {
          clearInterval(prev[index].interval);
          return prev.filter((_, i) => i !== index);
        }
        return prev;
      });
    },
    [showToast]
  );

  // 소켓 이벤트 리스닝
  useEffect(() => {
    const handleNewWord = (newWord: string) => {
      console.log(`새 단어: ${newWord}`);
      setWaitWords((prev) => [...prev, newWord]);
    };

    const handleScore = (score: number) => {
      setScore(score);
    };

    const handleGameover = (score: number) => {
      console.log("게임오버!!! ");
      setGameover(true);
      setScore(score);

      // 모든 단어의 인터벌 정리
      setActiveWordObjs((prev) => {
        prev.forEach((wordObj) => clearInterval(wordObj.interval));
        return [];
      });

      setIsSucceeded(false);
    };

    const handleResult = (data: { result: boolean; score: number }) => {
      const { result, score } = data;
      console.log(`최종 결과: result:${result}, score: ${score}`);
      setScore(score);
      setGameover(true);

      // 모든 단어의 인터벌 정리
      setActiveWordObjs((prev) => {
        prev.forEach((wordObj) => clearInterval(wordObj.interval));
        return [];
      });

      setIsSucceeded(result);
    };

    socket.on(Event.Inbound.Word, handleNewWord);
    socket.on(Event.Inbound.Score, handleScore);
    socket.on(Event.Inbound.Hit, handleHit);
    socket.on(Event.Inbound.Wrong, handleWrong);
    socket.on(Event.Inbound.GameOver, handleGameover);
    socket.on(Event.Inbound.Miss, handleMissedWord);
    socket.on(Event.Inbound.Result, handleResult);

    return () => {
      socket.off(Event.Inbound.Word, handleNewWord);
      socket.off(Event.Inbound.Score, handleScore);
      socket.off(Event.Inbound.Hit, handleHit);
      socket.off(Event.Inbound.Wrong, handleWrong);
      socket.off(Event.Inbound.GameOver, handleGameover);
      socket.off(Event.Inbound.Miss, handleMissedWord);
      socket.off(Event.Inbound.Result, handleResult);
    };
  }, [socket, handleHit, handleWrong, handleMissedWord]);

  // 게임 실행 관련
  useEffect(() => {
    if (!gameover && !showHelp && socket) {
      inputRef.current?.focus();
      document.addEventListener("click", handleClick);

      // 정기적으로 화면 갱신
      const repaintInterval = setInterval(() => {
        repaint();
      }, dropIntervalMs);

      return () => {
        clearInterval(repaintInterval);
        document.removeEventListener("click", handleClick);
      };
    }
  }, [gameover, showHelp, socket, dropIntervalMs]);

  // 소켓 연결 상태 모니터링
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

  // waitWords 변화 감지하여 dropWord 호출
  useEffect(() => {
    if (waitWords.length !== 0 && !gameover && !showHelp) {
      dropWord();
    }
  }, [waitWords, gameover, showHelp]);

  // 단어 드롭 함수
  const dropWord = useCallback(() => {
    const wordsCopy = [...waitWords];
    const word = wordsCopy.shift();

    if (!word) return;

    setWaitWords(wordsCopy);

    const boardElement = document.getElementById("board");
    const boardWidth = boardElement?.offsetWidth || 0;

    const maxWidth = 400;
    const xOffset = (boardWidth - maxWidth) / 2;
    const xPosition = xOffset + Math.random() * Math.min(boardWidth, maxWidth);

    const wordInstance: WordInstance = {
      word,
      x: xPosition,
      y: 0,
      interval: setInterval(() => {
        setActiveWordObjs((prev) => {
          const updatedWords = prev.map((obj) =>
            obj.word === word ? { ...obj, y: obj.y + dropDistance } : obj
          );

          // 필터링 제거 - repaint 함수에서 처리
          return updatedWords;
        });
      }, dropIntervalMs) as unknown as number,
    };

    setActiveWordObjs((prev) => [...prev, wordInstance]);
  }, [waitWords, dropDistance, dropIntervalMs]);

  // 화면 리페인트 및 바닥에 닿은 단어 처리
  const repaint = useCallback(() => {
    if (!gamePanelRef.current) return;

    const panelHeight = gamePanelRef.current.offsetHeight;

    setActiveWordObjs((prev) => {
      const updatedWords: WordInstance[] = [];

      for (const wordObj of prev) {
        // 이미 처리된 단어는 제외
        if (processedWordsRef.current.has(wordObj.word)) {
          clearInterval(wordObj.interval);
          continue;
        }

        // 바닥에 닿았는지 확인
        if (wordObj.y >= panelHeight - 30) {
          // 서버에 단어를 놓쳤다고 알림
          if (socket && !gameover) {
            socket.emit(Event.Outbound.Miss, { word: wordObj.word });
            processedWordsRef.current.add(wordObj.word);
          }
          clearInterval(wordObj.interval);
        } else {
          // 아직 바닥에 닿지 않은 단어는 유지
          updatedWords.push(wordObj);
        }
      }

      return updatedWords;
    });
  }, [socket, gameover]);

  // 사용자 입력 단어 처리
  const hitWord = useCallback(
    (word: string) => {
      if (socket && word.trim() && !gameover) {
        socket.emit(Event.Outbound.Answer, { answer: word });
        console.log(`서버에 유저 입력 단어 전송: ${word}`);
      }
    },
    [socket, gameover]
  );

  // 키보드 입력 처리
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.nativeEvent.isComposing) {
        return;
      }

      if (inputRef.current) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          hitWord(inputRef.current.value.trim());
          inputRef.current.value = "";
        }
      }
    },
    [hitWord]
  );

  // 게임 시작
  const startGame = useCallback(() => {
    // 기존 게임 상태 초기화
    setActiveWordObjs((prev) => {
      prev.forEach((wordObj) => clearInterval(wordObj.interval));
      return [];
    });
    setWaitWords([]);
    setScore(0);
    setFailed(0);
    setGameover(false);
    setShowHelp(false);
    processedWordsRef.current.clear();

    // 입력 필드 포커스
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // 게임 시작 이벤트 발생
    if (socket) {
      socket.connect();
      socket.emit(Event.Outbound.Start, {
        gamePanelOffsetHeight: gamePanelRef.current?.offsetHeight || 600,
      });
    }
  }, [socket]);

  // 클릭 시 입력 필드 포커스
  const handleClick = useCallback(() => {
    if (!gameover && !showHelp) {
      inputRef.current?.focus();
    }
  }, [gameover, showHelp]);

  // 결과 페이지 이동
  const handleResultPageNavigation = useCallback(() => {
    if (isSucceeded) {
      nav("/questsuccess");
    } else {
      nav("/questfail");
    }
  }, [isSucceeded, nav]);

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
            <input
              type="text"
              ref={inputRef}
              onKeyDown={handleKeyDown}
              disabled={gameover || showHelp}
            />
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
