import { useParams, useSearchParams } from "react-router-dom";
import { usePreventRefresh } from "../../../services/usePreventRefresh";
import { WebSocketProvider } from "../../../services/WebSocketContext";
import DuksaeJump from "./DuksaeJump";
import { DuksaeJumpQuestData } from "./DuksaeJump.types";

function DuksaeJumpPage() {
  usePreventRefresh();
  const accessToken = localStorage.getItem("accessToken");

  const [searchParams] = useSearchParams();
  const data: DuksaeJumpQuestData = {
    objectSpeed: parseFloat(searchParams.get("objectSpeed")!),
    objectMaxSpeed: parseFloat(searchParams.get("objectMaxSpeed")!),
    speedIncreaseRate: parseFloat(searchParams.get("speedIncreaseRate")!),
    speedIncreaseInterval: parseInt(searchParams.get("speedIncreaseInterval")!),
    gameoverLimit: parseInt(searchParams.get("gameoverLimit")!),
    passingScore: parseInt(searchParams.get("passingScore")!),
  };

  return (
    <WebSocketProvider token={accessToken}>
      <DuksaeJump data={data} />
    </WebSocketProvider>
  );
}

export default DuksaeJumpPage;
