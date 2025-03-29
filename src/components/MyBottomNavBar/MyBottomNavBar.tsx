import { useNavigate } from "react-router-dom";

import "./MyBottomNavBar.css";
import { useState } from "react";
import { useAuth } from "../../services/AuthContext";
import LoginModal from "../Modal/LoginModal";

const MyBottomNavBar = () => {
  const { isAuthenticated } = useAuth();
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
            <img
              onClick={() => navigate("/history")}
              src="/src/assets/images/history.png"
            />
          </div>
          <div>
            <p>랭킹</p>
            <img
              onClick={() => navigate("/ranking")}
              src="/src/assets/images/ranking.png"
            />
          </div>
          <div>
            <p>거래</p>
            <img
              onClick={() => navigate("/nft-exchange")}
              src="/src/assets/images/deal.png"
            />
          </div>
          <div>
            <p>스토리</p>
            <img
              onClick={() => navigate("/story")}
              src="/src/assets/images/story.png"
            />
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
            <img src="/src/assets/images/home.png" /> <p>홈</p>
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              navigate("/quest");
            }}
          >
            <img src="/src/assets/images/quest.png" />
            <p>퀘스트</p>
          </button>
        </div>
        <div>
          <button
            type="button"
            className={clickedplus == true ? "clickedplus" : "notclickedplus"}
            onClick={plusButton}
          >
            <img src="/src/assets/images/plus.png" />
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              navigate("/store");
            }}
          >
            <img src="/src/assets/images/shop.png" />
            <p>상점</p>
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              //console.log("isAuthenticated: :", isAuthenticated);
              if (isAuthenticated) {
                navigate("/mypage");
              } else {
                setShowLoginModal(true);
              }
            }}
          >
            <img src="/src/assets/images/my.png" />
            <p>마이페이지</p>
          </button>
        </div>
      </nav>
      <LoginModal
        isOpen={showLoginModal}
        content="마이페이지를 확인하려면 로그인이 필요합니다."
        onClose={handleLoginModalClose}
        onLogin={() => {
          navigate("/login");
          setShowLoginModal(false);
        }}
      />
    </>
  );
};

export default MyBottomNavBar;
