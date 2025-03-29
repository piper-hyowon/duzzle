import { useNavigate } from "react-router-dom";
import "./QuestFail.css";
import CanvasAnimation from "./Speed/CanvasAnimation";

function QuestFail() {
  const nav = useNavigate();
  return (
    <div className="QuestFail">
      {/* <CanvasAnimation /> */}
      <div className="text_suc">미션 실패</div>
      <img src="/src/pages/Quest/sad.gif" alt="Sad" className="Sad" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />

      <div className="buttons">
        <button
          className="btn1 btn-primary btn-jittery"
          onClick={() => nav("/story")}
        >
          스토리 <br />
          학습하기
        </button>
        <button
          className="btn2 btn-primary btn-jittery"
          onClick={() => nav("/quest")}
        >
          다시 도전하기
        </button>
      </div>
    </div>
  );
}

export default QuestFail;
