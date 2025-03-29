import { useLocation, useNavigate } from "react-router-dom";
import ThreeDScene from "../../components/3dModel/ThreeDScene";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import { Minted, PieceDto } from "../../Data/DTOs/PieceDTO";
import "./NftDetailPage.css";

const NFTDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state as { data: PieceDto };
  if (!data) {
    return <div>NFT 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="nft-detail-page">
      <div className="nft-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg
            data-slot="icon"
            fill="none"
            strokeWidth="2.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <h1>NFT 상세 정보</h1>
      </div>

      <div className="three-d-container">
        <ThreeDScene
          width="100%"
          height="calc(100vh - 160px)"
          url={(data.data as Minted).threeDModelUrl}
          nftInfo={data}
        />
      </div>
      <MyBottomNavBar />
    </div>
  );
};

export default NFTDetail;
