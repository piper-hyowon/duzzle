import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./QuestSpeed.css";
import { QuestApis } from "../../../services/api/quest.api";

function QuestSpeed() {
  const nav = useNavigate();
  const [timeLimit, setTimeLimit] = useState(30);
  const [answers, setAnswers] = useState([]);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [questData, setQuestData] = useState(null);
  const [logId, setLogId] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    getRandomSpeedQuest();
  }, []);

  useEffect(() => {
    // 타이머
    if (isTimerRunning && timeLimit > 0) {
      const timer = setTimeout(() => {
        setTimeLimit(timeLimit - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLimit === 0) {
      setIsTimerRunning(false);
      nav("/questfail");
    }
  }, [isTimerRunning, timeLimit]);

  const handleInputChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    const filteredAnswers = answers.filter((answer) => answer.trim() !== "");
    const result = token
      ? await QuestApis.getResult(
          { logId: Number(logId), answer: filteredAnswers },
          {
            Authorization: token,
          }
        )
      : await QuestApis.getResultForGuest({
          logId: Number(logId),
          answer: filteredAnswers,
        });
    if (result) {
      nav("/questsuccess");
    } else {
      nav("/questfail");
    }
    setIsCompleted(true);
    setIsTimerRunning(false);
  };

  const getRandomSpeedQuest = async () => {
    try {
      const quest = localStorage.getItem("quest");
      const logId = localStorage.getItem("logId");
      const time = localStorage.getItem("timeLimit");
      const questParts = quest.split("?").filter((part) => part.trim() !== "");
      setQuestData(questParts.join("?"));
      setLogId(logId);
      setTimeLimit(Number(time));
      setAnswers(Array(questParts.length).fill(""));
      setIsCompleted(false);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.error("모든 퀘스트를 이미 완료했습니다.");
      } else {
        console.error("Error fetching random speed quest:", error);
        nav("/questfail");
      }
    }
  };

  return (
    <div className="QuestSpeed">
      {questData && (
        <>
          <div className="speed-quiz-title">스피드 퀴즈</div>
          <div className="time-info">
            <div className="time">제한시간: </div>
            <div className="info">{timeLimit}초</div>
          </div>
          <div className="quiz-container">
            <div className="quiz">
              {questData.split("?").map((part, index) => (
                <span key={index}>
                  {part}
                  {index !== questData.split("?").length - 1 && (
                    <input
                      className="input_text"
                      type="text"
                      max="10"
                      value={answers[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                  )}
                </span>
              ))}
            </div>
          </div>
          <div className="buttons">
            <button className="submit btn" onClick={handleSubmit}>
              제출하기
            </button>
            <button className="quit btn" onClick={() => nav("/questfail")}>
              그만하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default QuestSpeed;
