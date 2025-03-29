import { useParams, useSearchParams } from "react-router-dom";
import { usePreventRefresh } from "../../../services/usePreventRefresh";
import { WebSocketProvider } from "../../../services/WebSocketContext";
import { useEffect } from "react";
import { AcidRainQuestData } from "./Acid.types";
import Acid from "./Acid";

function AcidPage() {
  // 새로고침 방지
  usePreventRefresh();
  const params = useParams();
  const logId: number = parseInt(params.logId!);
  const accessToken = localStorage.getItem("accessToken");

  const [searchParams] = useSearchParams();
  const data: AcidRainQuestData = {
    dropIntervalMs: parseFloat(searchParams.get("dropIntervalMs")!),
    dropDistance: parseFloat(searchParams.get("dropDistance")!),
    newWordIntervalMs: parseFloat(searchParams.get("newWordIntervalMs")!),
    gameoverLimit: parseInt(searchParams.get("gameoverLimit")!),
    passingScore: parseInt(searchParams.get("passingScore")!),
  };

  useEffect(() => {
    // 퀘스트 진행 페이지는 로그인 유저만 가능
    // if (!accessToken) {
    //   if (confirm("로그인이 필요한 서비스입니다."))
    //     document.location = "/login";
    // }
    // 퀘스트시작버튼을 통해 넘어온 요청이 아닌, url 임의로 입력해서 온 접근 차단
    // url path parameter 의 logId 당 한번만 진행 가능
    if (!Object.values(data).every((e) => !!e)) {
      alert("잘못된 접근");
    }
  });

  return (
    <WebSocketProvider token={accessToken}>
      <Acid logId={logId} data={data} />
    </WebSocketProvider>
  );
}

export default AcidPage;
