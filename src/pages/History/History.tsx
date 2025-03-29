import { useEffect, useState } from "react";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import "./History.css";
import axios from "axios";
import { SeasonHistoryResponse } from "../../Data/DTOs/HistoryDTO";
import { useNavigate } from "react-router-dom";

function History() {
  const navigate = useNavigate();
  const RequestUrl = import.meta.env.VITE_REQUEST_URL;

  const [historySeasons, setHistorySeasons] = useState<SeasonHistoryResponse[]>(
    []
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(RequestUrl + "/v1/season-history", {});
        if (response.data.result) {
          //console.log(response.data.data);
          setHistorySeasons(response.data.data.list);
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, [RequestUrl]);

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
