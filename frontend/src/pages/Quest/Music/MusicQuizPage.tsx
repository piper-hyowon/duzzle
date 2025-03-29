import "./MusicQuizPage.css";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QuestApis } from "../../../services/api/quest.api";
import { useAudio } from "../../../services/useAudio";
import { LyricsInput } from "../../../components/LyricsInput";

const MusicQuizPage: React.FC = () => {
  const isAuthenticated = localStorage.getItem("accessToken");
  const nav = useNavigate();
  const { logId } = useParams<{ logId: string }>();
  const lyrics = localStorage.getItem("lyrics") || "";
  const audioUrl = localStorage.getItem("audioUrl");
  const timeLimit = parseInt(localStorage.getItem("timeLimit") || "30", 10);

  const [answers, setAnswers] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  const { audioRef, audioLoaded, error } = useAudio(audioUrl);

  useEffect(() => {
    const blankCount = (lyrics.match(/\?\?/g) || []).length;
    setAnswers(new Array(blankCount).fill(""));
  }, [lyrics]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prevTime) => prevTime - 1), 1000);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft]);

  const handleStart = useCallback(() => {
    setIsStarted(true);
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error("Audio play error:", e));
    }
  }, [audioRef]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsStarted(false);
  }, [audioRef]);

  const handleQuit = useCallback(() => {
    stopAudio();
    nav("/questfail");
  }, [nav, stopAudio]);

  const handleSubmit = useCallback(async () => {
    stopAudio();
    if (!logId) {
      console.error("LogId is undefined");
      return;
    }

    try {
      const result = isAuthenticated
        ? await QuestApis.getResult(
            { logId: Number(logId), answer: answers },
            {
              Authorization: isAuthenticated,
            }
          )
        : await QuestApis.getResultForGuest({
            logId: Number(logId),
            answer: answers,
          });

      nav(result ? "/questsuccess" : "/questfail");
    } catch (error) {
      console.error("Error submitting answers:", error);
      // 에러 처리 로직 (예: 사용자에게 알림)
    }
  }, [isAuthenticated, logId, answers, nav, stopAudio]);

  // const formatTime = (seconds: number): string => {
  //   const minutes = Math.floor(seconds / 60);
  //   const remainingSeconds = seconds % 60;
  //   return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
  //     .toString()
  //     .padStart(2, "0")}`;
  // };

  if (!isStarted) {
    return (
      <div className="quiz-music">
        <p className="qm-title">음악 퀴즈</p>
        <p className="qm-info">
          시작 버튼을 누르면 음악이 재생되고 퀴즈가 시작됩니다
        </p>
        <button
          className="btn start"
          onClick={handleStart}
          disabled={!audioLoaded}
          style={{
            cursor: audioLoaded ? "pointer" : "not-allowed",
          }}
        >
          {audioLoaded ? "시작하기" : "오디오 로딩 중..."}
        </button>
        {error && <p style={{ color: "red", margin: "10px 0 0 0" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div className="quiz-music">
      <p className="qm-question">가사 받아쓰기</p>
      <p className="qm-question">노래를 듣고 빈칸에 알맞은 가사를 입력하세요</p>
      <div className="qm-time-info">
        <p>제한시간: </p>
        <p className="time-second"> {timeLeft}초</p>
      </div>
      <LyricsInput lyrics={lyrics} answers={answers} setAnswers={setAnswers} />
      <div className="qm-buttons">
        <button className="btn submit" onClick={handleSubmit}>
          제출하기
        </button>
        <button className="btn quit" onClick={handleQuit}>
          그만하기
        </button>
      </div>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default MusicQuizPage;
