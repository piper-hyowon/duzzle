import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { usePreventRefresh } from "../../../services/usePreventRefresh";
import { WebSocketProvider } from "../../../services/WebSocketContext";
import DuksaeJump from "./DuksaeJump";
import { DuksaeJumpQuestData } from "./DuksaeJump.types";

function DuksaeJumpPage() {
  usePreventRefresh();
  const params = useParams();
  const logId: number = parseInt(params.logId!);
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

  useEffect(() => {
    console.log("Data:", data);
    if (!Object.values(data).every((e) => !!e)) {
      alert("잘못된 접근");
    }
  }, [data]);

  return (
    <WebSocketProvider token={accessToken}>
      <DuksaeJump logId={logId} data={data} />
    </WebSocketProvider>
  );
}

export default DuksaeJumpPage;
