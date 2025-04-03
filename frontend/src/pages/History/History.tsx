import { useEffect, useState } from "react";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import "./History.css";
import { SeasonHistoryResponse } from "../../Data/DTOs/HistoryDTO";
import { useNavigate } from "react-router-dom";
import { mockApiService } from "../../services/mockServices";

function History() {
  const navigate = useNavigate();
  const [historySeasons, setHistorySeasons] = useState<SeasonHistoryResponse[]>(
    []
  );

  useEffect(() => {
    setHistorySeasons(mockApiService.history.list());
  }, []);

  return (
    <div className="History">
      <p className="history_title">시즌 히스토리</p>
      <div className="historySeason_main">
        {historySeasons.map((season) => (
          <div
            className="historySeason"
            key={season.id}
            onClick={() =>
              navigate(`/history/${season.id}`, {
                state: { seasonTitle: season.title },
              })
            }
          >
            <img src={season.thumbnailUrl} alt={season.title} />
            <div className="season_info">
              <p className="season_title">{season.title}</p>
              <p>전체 퍼즐 조각: {season.totalPieces}</p>
              <p>발행된 퍼즐 조각NFT: {season.mintedPieces}</p>
            </div>
          </div>
        ))}
      </div>
      <MyBottomNavBar />
    </div>
  );
}

export default History;
