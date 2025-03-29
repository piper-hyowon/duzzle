import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import "./QuestSuccess.css";
import { useAuth } from "../../services/AuthContext";

function QuestSuccess() {
  const nav = useNavigate();
  // const { isAuthenticated } = useAuth(); // TODO: dev 에 반영되면 주석 해제
  const isAuthenticated = !!localStorage.getItem("accessToken");

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
    if (isAuthenticated) {
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
    } else {
      return (
        <>
          <div className="text_guest">회원가입하고 DAL 받기</div>
          <div className="buttons">
            <button
              className="btn btn-primary btn-jittery"
              onClick={() => nav("/login")}
            >
              회원가입하러 가기
            </button>
          </div>
        </>
      );
    }
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
