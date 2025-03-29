import "./HistoryRanking.css";

import { useParams } from "react-router-dom";
import MyHeader from "../../components/MyHeader/MyHeader";
import MyButton from "../../components/MyButton/MyButton";
import { useEffect, useState } from "react";
import axios from "axios";

// 이미지
import duk1Img from "../Ranking/duk1.png";
import duk2Img from "../Ranking/duk2.png";
import duk3Img from "../Ranking/duk3.png";

interface UserRanking {
  rank: number;
  name: string;
  walletAddress: string;
  nftHoldings: number;
  nftHoldingsPercentage: number;
}

function HistoryRanking() {
  const { seasonId } = useParams();

  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const RequestURL = import.meta.env.VITE_REQUEST_URL;
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get(
          `${RequestURL}/v1/season-history/rankings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              seasonId: seasonId,
            },
          }
        );
        if (response.data.result) {
          const list = response.data.data.list;

          list.sort(
            (a: UserRanking, b: UserRanking) => b.nftHoldings - a.nftHoldings
          );

          let currentRank = 1;
          list.forEach((item: UserRanking, index: number) => {
            if (index > 0 && list[index - 1].nftHoldings === item.nftHoldings) {
              item.rank = list[index - 1].rank;
            } else {
              item.rank = currentRank;
            }
            currentRank++;
          });

          setRankings(list);
        } else {
          console.error("Failed to fetch rankings");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchRankings();
  }, [RequestURL, seasonId, token]);

  return (
    <div className="HistoryRanking">
      <MyHeader headerText="히스토리" leftChild={<MyButton />} />
      <div className="ranking_main">
        <div className="ranking_top">
          {rankings.slice(0, 3).map((user, index) => {
            const imageSrc = [duk1Img, duk2Img, duk3Img][index];

            return (
              <div key={index} className={`podium-rank rank-${index + 1}`}>
                <div className="image-container">
                  <div className="crown">👑</div>
                  <img
                    src={imageSrc}
                    alt={`순위 ${index + 1}`}
                    className="podium-image"
                  />
                </div>
                <div className="podium-name" style={{ cursor: "pointer" }}>
                  {user.name}
                </div>
                <div className="podium-position" style={{ cursor: "pointer" }}>
                  {index + 1}위
                </div>
              </div>
            );
          })}
        </div>
        <div className="ranking_chart">
          <div className="ranking-header">
            <span className="rank_t">순위</span>
            <span className="name_t">닉네임</span>
            <span className="nft-holdings_t">NFT 개수</span>
          </div>
          {rankings.map((user) => (
            <div
              key={user.rank}
              id={`rank-${user.rank}`}
              className="ranking-item"
            >
              <span className="rank">{user.rank}위</span>
              <span className="name">{user.name}</span>
              <span className="nft-holdings">{user.nftHoldings}개</span>
              <span className="nft-percentage">
                {Number.isInteger(user.nftHoldingsPercentage)
                  ? `${user.nftHoldingsPercentage}%`
                  : `${user.nftHoldingsPercentage.toFixed(2)}%`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HistoryRanking;
