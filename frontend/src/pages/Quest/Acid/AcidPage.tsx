import { usePreventRefresh } from "../../../services/usePreventRefresh";
import Acid from "./Acid";
import { MockWebSocketProvider } from "../../../services/WebSocketContext";
import { useSearchParams } from "react-router-dom";

function AcidPage() {
  usePreventRefresh();
  const [searchParams] = useSearchParams();

  const data = {
    dropIntervalMs: parseFloat(searchParams.get("dropIntervalMs")!),
    dropDistance: parseFloat(searchParams.get("dropDistance")!),
    newWordIntervalMs: parseFloat(searchParams.get("newWordIntervalMs")!),
    gameoverLimit: parseInt(searchParams.get("gameoverLimit")!),
    passingScore: parseInt(searchParams.get("passingScore")!),
  };
  return (
    <MockWebSocketProvider>
      <Acid data={data} />
    </MockWebSocketProvider>
  );
}

export default AcidPage;
