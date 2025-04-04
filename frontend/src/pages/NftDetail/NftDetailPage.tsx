import { useLocation, useNavigate } from "react-router-dom";
import ThreeDScene from "../../components/3dModel/ThreeDScene";
import { Minted, PieceDto } from "../../Data/DTOs/PieceDTO";
import "./NftDetailPage.css";
import { useEffect } from "react";

const NFTDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { data: PieceDto } | null;

  useEffect(() => {
    if (!locationState || !locationState.data) {
      navigate("/notfound", { replace: true });
    }
  }, [locationState, navigate]);

  if (!locationState || !locationState.data) {
    return (
      <div className="loading-container">
        <p>데이터를 불러오는 중...</p>
      </div>
    );
  }

  // 이제 안전하게 data 접근 가능
  const { data } = locationState;
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
          isFullscreen={true}
        />
      </div>
    </div>
  );
};

export default NFTDetail;
