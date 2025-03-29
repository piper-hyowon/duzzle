import { useNavigate } from "react-router-dom";
import "./Quest.css";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import {
  QuestApis,
  QuestApisForTest,
  QuestType,
} from "../../services/api/quest.api";

function Quest() {
  const nav = useNavigate();

  const startQuiz = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const header = {
        Authorization: token,
      };
      const response = token
        ? await QuestApis.startQuest(header)
        : //await QuestApisForTest.startSpeedQuiz();
          await QuestApis.startForGuest();
      // console.log("Quest POST 성공", response);

      if (response.type === QuestType.SpeedQuiz) {
        localStorage.setItem("logId", response.logId.toString());
        localStorage.setItem("quest", response.quest);
        localStorage.setItem("timeLimit", response.timeLimit.toString());
        nav("/questspeed");
      } else if (response.type === QuestType.AcidRain) {
        const quest = JSON.parse(response.quest);
        const queryParms = Object.entries(quest)
          .map(([key, value]) => `${key}=${value}`)
          .join("&");
        nav(`/questacid/${response.logId}?`.concat(queryParms));
      } else if (response.type === QuestType.DuksaeJump) {
        const quest = JSON.parse(response.quest);
        const queryParams = Object.entries(quest)
          .map(([key, value]) => `${key}=${value}`)
          .join("&");
        nav(`/duksaejump/${response.logId}?`.concat(queryParams));
      } else if (response.type === QuestType.PictureQuiz) {
        localStorage.setItem("logId", response.logId.toString());
        localStorage.setItem("quest", response.quest);
        localStorage.setItem("timeLimit", response.timeLimit.toString());
        nav(`/picturequiz/${response.logId}`);
      } else if (response.type === QuestType.MusicQuiz) {
        const quest = JSON.parse(response.quest);
        localStorage.setItem("logId", response.logId.toString());
        localStorage.setItem("lyrics", quest.lyrics);
        localStorage.setItem("audioUrl", quest.audioUrl);
        localStorage.setItem("timeLimit", response.timeLimit.toString());
        nav(`/musicquiz/${response.logId}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.error("모든 퀘스트 완료 => 409 오류");
        alert("모든 퀘스트를 완료하였습니다. 최고에요!");
      } else {
        console.error("Error submitting result:", error);
      }
    }
  };

  return (
    <div className="Quest">
      <div className="random"> Mini Game</div>
      <img src="/src/pages/Quest/Tree.gif" alt="Tree" className="Tree" />
      <div className="snowflakes" aria-hidden="true">
        <div className="snowflake">❄️</div>
        <div className="snowflake">❄️</div>
        <div className="snowflake">❄️</div>
        <div className="snowflake">❄️</div>
        <div className="snowflake">❄️</div>
        <div className="snowflake">❄️</div>
      </div>
      {/* <div id="wrap">
        <div className="dice">
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
          <div>6</div>
        </div>
      </div> */}
      <button className="quest_button" onClick={startQuiz}>
        START
      </button>
      <MyBottomNavBar />
    </div>
  );
}

export default Quest;
