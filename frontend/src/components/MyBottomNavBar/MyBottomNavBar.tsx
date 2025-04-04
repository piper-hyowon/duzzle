import { useNavigate } from "react-router-dom";

import "./MyBottomNavBar.css";
import { useState } from "react";

const HomeIcon = "/assets/images/home.png";
const HistoryIcon = "/assets/images/history.png";
const RankingIcon = "/assets/images/ranking.png";
const NftExchangeIcon = "/assets/images/deal.png";
const StoryIcon = "/assets/images/story.png";

const PlusButton = "/assets/images/plus.png";
const Shop = "/assets/images/shop.png";
const My = "/assets/images/my.png";

const MyBottomNavBar = () => {
  const navigate = useNavigate();
  const [clickedplus, setClickedplus] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);

  const plusButton = () => {
    setClickedplus(!clickedplus);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      {clickedplus ? (
        <nav className="plusNavBar">
          <div>
            <p>시즌 히스토리</p>
            <img onClick={() => navigate("/history")} src={HistoryIcon} />
          </div>
          <div>
            <p>랭킹</p>
            <img onClick={() => navigate("/ranking")} src={RankingIcon} />
          </div>
          <div>
            <p>거래</p>
            <img
              onClick={() => navigate("/nft-exchange")}
              src={NftExchangeIcon}
            />
          </div>
          <div>
            <p>스토리</p>
            <img onClick={() => navigate("/story")} src={StoryIcon} />
          </div>
        </nav>
      ) : null}
      <nav className="MyBottomNavBar">
        <div>
          <button
            type="button"
            onClick={() => {
              navigate("/");
            }}
          >
            <img src={HomeIcon} /> <p>홈</p>
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              navigate("/quest");
            }}
          >
            <img src="/assets/images/quest.png" />
            <p>퀘스트</p>
          </button>
        </div>
        <div>
          <button
            type="button"
            className={clickedplus == true ? "clickedplus" : "notclickedplus"}
            onClick={plusButton}
          >
            <img src={PlusButton} />
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              navigate("/store");
            }}
          >
            <img src={Shop} />
            <p>상점</p>
          </button>
        </div>
        <div>
          <button type="button" onClick={() => navigate("/mypage")}>
            <img src={My} />
            <p>마이페이지</p>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MyBottomNavBar;
