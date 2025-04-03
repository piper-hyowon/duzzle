import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import "./QuestSuccess.css";

function QuestSuccess() {
  const nav = useNavigate();

  useEffect(() => {
    const confettiInterval = setInterval(() => {
      confetti({
        particleCount: 150,
        spread: 60,
      });
    }, 3000);

    return () => clearInterval(confettiInterval);
  }, []);

  const renderContent = () => {
    return (
      <>
        <div className="text_dal">1DAL</div>
        <div className="text_done">지급 완료</div>
        <div className="buttons">
          <button
            className="btn btn-primary btn-jittery"
            onClick={() => nav("/store")}
          >
            상점에서 재료 NFT 구입
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="Questsuccess">
      <div className="text_suc">미션 성공</div>
      <img src="/src/pages/Quest/happy.gif" alt="happy" className="happy" />
      {renderContent()}
    </div>
  );
}

export default QuestSuccess;
