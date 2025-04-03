import "./PictureQuizPage.css";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockApiService } from "../../../services/mockServices";
import { QuestType } from "../../../enum/quest.enum";

const PictureQuizPage: React.FC = () => {
  const nav = useNavigate();
  const [answer, setAnswer] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const images = localStorage.getItem("quest").split("{}");

  useEffect(() => {
    const timeLimit = 40;
    setTimeLeft(timeLimit);

    const timeLimitInSeconds = 40;
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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = useCallback(async () => {
    const result = await mockApiService.quest.result(QuestType.PictureQuiz, [
      answer,
    ]);

    if (result) {
      nav("/questsuccess");
    } else {
      nav("/questfail");
    }
  }, []);

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
