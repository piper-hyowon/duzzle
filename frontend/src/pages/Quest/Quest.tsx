import { useNavigate } from "react-router-dom";
import "./Quest.css";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import { QuestType } from "../../enum/quest.enum";
import { mockApiService } from "../../services/mockServices";

function Quest() {
  const nav = useNavigate();

  const startQuiz = async (type: QuestType) => {
    const response = await mockApiService.quest.start(type);

    if (type === QuestType.SpeedQuiz) {
      localStorage.setItem("quest", response.quest);
      localStorage.setItem("timeLimit", response.timeLimit.toString());
      nav("/questspeed");
    } else if (type === QuestType.AcidRain) {
      const quest = JSON.parse(response.quest);
      const queryParms = Object.entries(quest)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      nav(`/questacid?`.concat(queryParms));
    } else if (type === QuestType.DuksaeJump) {
      const quest = JSON.parse(response.quest);
      const queryParams = Object.entries(quest)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      nav(`/duksaejump?`.concat(queryParams));
    } else if (type === QuestType.PictureQuiz) {
      localStorage.setItem("quest", response.quest);
      localStorage.setItem("timeLimit", response.timeLimit.toString());
      nav(`/picturequiz`);
    } else if (type === QuestType.MusicQuiz) {
      const quest = JSON.parse(response.quest);
      localStorage.setItem("lyrics", quest.lyrics);
      localStorage.setItem("audioUrl", quest.audioUrl);
      localStorage.setItem("timeLimit", response.timeLimit.toString());
      nav(`/musicquiz`);
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

      <div className="game-selection">
        <button
          className="quest_button"
          onClick={() => startQuiz(QuestType.SpeedQuiz)}
        >
          속도 퀴즈
        </button>
        <button
          className="quest_button"
          onClick={() => startQuiz(QuestType.AcidRain)}
        >
          산성비
        </button>
        <button
          className="quest_button"
          onClick={() => startQuiz(QuestType.DuksaeJump)}
        >
          덕새 점프
        </button>
        <button
          className="quest_button"
          onClick={() => startQuiz(QuestType.PictureQuiz)}
        >
          그림 퀴즈
        </button>
        <button
          className="quest_button"
          onClick={() => startQuiz(QuestType.MusicQuiz)}
        >
          음악 퀴즈
        </button>
      </div>
    </div>
  );
}

export default Quest;
