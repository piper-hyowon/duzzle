import "./Mypage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import { showDemoFeatureToast } from "../../components/Toast";
import { MOCK_USER_DATA } from "../../services/mockData";

function Mypage() {
  const navigate = useNavigate();

  return (
    <div className="Mypage">
      <p
        className="logout"
        onClick={() => showDemoFeatureToast("로그아웃 기능은")}
      >
        로그아웃
      </p>
      <div className="user_image">
        <img src="/assets/images/mock/user/goblin_baby.png" />
      </div>
      <div className="user_info">
        <p className="user_name">{MOCK_USER_DATA.name}</p>
        <p className="user_email">{MOCK_USER_DATA.email}</p>
      </div>
      <div className="user_dal">
        <img src="/assets/images/moon.png" /> <p>100,000 Dal</p>
      </div>

      <div className="user_menu">
        <section className="user_profile" onClick={() => navigate("/profile")}>
          <p>프로필</p>
        </section>
        <section className="user_nft">
          <div className="nft_items" onClick={() => navigate("/mypage/items")}>
            <img src="/assets/images/item.png" />
            <p>99 Items</p>
          </div>
          <div
            className="nft_pieces"
            onClick={() => navigate("/mypage/pieces")}
          >
            <img src="/assets/images/piece.png" />
            <p>11 Pieces</p>
          </div>
        </section>
        <section className="user_setting" onClick={() => navigate("/setting")}>
          <p>설정</p>
        </section>
      </div>

      <MyBottomNavBar />
    </div>
  );
}

export default Mypage;
