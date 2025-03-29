import "./PictureQuizPage.css";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QuestApis } from "../../../services/api/quest.api";

const PictureQuizPage: React.FC = () => {
  //   const { isAuthenticated } = useAuth(); TODO: dev 에 반영되면 주석 해제
  const isAuthenticated = localStorage.getItem("accessToken");
  const nav = useNavigate();
  const logId = useParams()?.logId;
  const [answer, setAnswer] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const images = localStorage.getItem("quest").split("{}");

  useEffect(() => {
    if (
      !logId ||
      !localStorage.getItem("quest") ||
      !localStorage.getItem("timeLimit") ||
      logId !== localStorage.getItem("logId")
    ) {
      nav("/notfound");
      return;
    }
    const timeLimit = parseInt(localStorage.getItem("timeLimit"));
    setTimeLeft(timeLimit);

    const timeLimitInSeconds = parseInt(localStorage.getItem("timeLimit"));
    setTimeLeft(timeLimitInSeconds);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [logId, nav]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = useCallback(async () => {
    const result = isAuthenticated
      ? await QuestApis.getResult(
          { logId: Number(logId), answer: [answer] },
          {
            Authorization: isAuthenticated,
          }
        )
      : await QuestApis.getResultForGuest({
          logId: Number(logId),
          answer: [answer],
        });
    if (result) {
      nav("/questsuccess");
    } else {
      nav("/questfail");
    }
  }, [isAuthenticated, logId, answer, nav]);

  // const formatTime = (seconds: number): string => {
  //   const minutes = Math.floor(seconds / 60);
  //   const remainingSeconds = seconds % 60;
  //   return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
  //     .toString()
  //     .padStart(2, "0")}`;
  // };

  return (
    <div className="quiz-picture">
      <p className="qp-title">그림 퀴즈</p>
      <div className="qp-time-info">
        <p>제한시간: </p>
        <p className="time-second"> {timeLeft}초</p>
      </div>
      <p className="qp-question">이 장소의 이름은?</p>
      <div className="qp-img">
        {images.map((src, index) => (
          <img key={index} src={src} alt={`퀴즈 이미지 ${index + 1}`} />
        ))}
      </div>
      <div className="qp-answer">
        <input
          type="text"
          value={answer}
          onChange={handleInputChange}
          placeholder="답을 입력하세요"
        />
      </div>
      <div className="qp-buttons">
        <button className="btn submit" onClick={handleSubmit}>
          제출하기
        </button>
        <button className="btn quit" onClick={() => nav("/questfail")}>
          그만하기
        </button>
      </div>
    </div>
  );
};

export default PictureQuizPage;
