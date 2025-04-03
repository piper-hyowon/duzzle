import "./HistoryRanking.css";

import { useParams } from "react-router-dom";
import MyHeader from "../../components/MyHeader/MyHeader";
import MyButton from "../../components/MyButton/MyButton";
import { useEffect, useState } from "react";

// 이미지
import duk1Img from "../Ranking/duk1.png";
import duk2Img from "../Ranking/duk2.png";
import duk3Img from "../Ranking/duk3.png";
import {
  MOCK_USER2,
  MOCK_USER3,
  MOCK_USER_DATA,
} from "../../services/mockData";

interface UserRanking {
  rank: number;
  name: string;
  walletAddress: string;
  nftHoldings: number;
  nftHoldingsPercentage: number;
}

function HistoryRanking() {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  useEffect(() => {
    const fetchRankings = async () => {
      const mockRankings: UserRanking[] = [
        {
          rank: 1,
          name: "나는덕새",
          walletAddress: MOCK_USER2.walletAddress,
          nftHoldings: 25,
          nftHoldingsPercentage: 16,
        },
        {
          rank: 2,
          name: "더즐킹",
          walletAddress: MOCK_USER3.walletAddress,
          nftHoldings: 24,
          nftHoldingsPercentage: 16,
        },
        {
          rank: 3,
          name: "컴공생임다",
          walletAddress: MOCK_USER_DATA.walletAddress,
          nftHoldings: 19,
          nftHoldingsPercentage: 12,
        },
        {
          rank: 4,
          name: "퍼즐지망생",
          walletAddress: MOCK_USER_DATA.walletAddress,
          nftHoldings: 18,
          nftHoldingsPercentage: 11,
        },
        {
          rank: 6,
          name: "더즐",
          walletAddress: MOCK_USER_DATA.walletAddress,
          nftHoldings: 26,
          nftHoldingsPercentage: 11,
        },
        {
          rank: 7,
          name: "가나다",
          walletAddress: MOCK_USER3.walletAddress,
          nftHoldings: 18,
          nftHoldingsPercentage: 11,
        },
        {
          rank: 8,
          name: "난보유많이",
          walletAddress: MOCK_USER2.walletAddress,
          nftHoldings: 18,
          nftHoldingsPercentage: 11,
        },
        {
          rank: 9,
          name: "덕성짱",
          walletAddress: MOCK_USER3.walletAddress,
          nftHoldings: 18,
          nftHoldingsPercentage: 11,
        },
        {
          rank: 126,
          name: "내가짱먹어",
          walletAddress: MOCK_USER_DATA.walletAddress,
          nftHoldings: 3,
          nftHoldingsPercentage: 0.02,
        },
      ];
      const myRanking =
        mockRankings.find(
          (item) => item.walletAddress === MOCK_USER_DATA.walletAddress
        ) || null;

      setRankings(mockRankings);
    };

    fetchRankings();
  }, []);

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
