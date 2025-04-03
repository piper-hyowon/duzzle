import "./DrThree.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AvailableNft, BlueprintOrPuzzleNft, MaterialNft } from "./Deal.dto";
import { mockApiService } from "../../services/mockServices";
import { MOCK_USER_DATA } from "../../services/mockData";
import { useState } from "react";
import AlertModal from "../../components/Modal/AlertModal";

function DrThree() {
  const navigate = useNavigate();
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const { state } = useLocation();
  const { selectedOfferNfts, selectedRequestNfts } = state as {
    selectedOfferNfts: AvailableNft[];
    selectedRequestNfts: AvailableNft[];
  };

  const fillerStyles = {
    width: `100%`,
  };

  const NftInfo = (nft: AvailableNft) => {
    let id: { contractId?: number; seasonZoneId?: number };

    if (nft.type === "material") {
      id = { contractId: (nft.nftInfo as MaterialNft).contractId };
    } else {
      id = { seasonZoneId: (nft.nftInfo as BlueprintOrPuzzleNft).seasonZoneId };
    }

    return {
      type: nft.type,
      ...id,
      quantity: nft.quantity,
    };
  };

  // 알림모달
  const openAlertModal = (content: string) => {
    setModalContent(content);
    setShowAlertModal(true);
  };
  const handleAlertModalClose = () => {
    setShowAlertModal(false);
    navigate('/nft-exchange')
  };

  const nftExchange = async () => {
    const params = {
      offeredNfts: selectedOfferNfts.map(NftInfo),
      requestedNfts: selectedRequestNfts.map(NftInfo),
    };
    try {
      mockApiService.nftExchange.postNftExchange(
        MOCK_USER_DATA.walletAddress,
        params
      );
    } catch (error) {
      openAlertModal(error.message);
    }
  };

  const setNftName = (nft: AvailableNft): string => {
    if (nft.type === "material") {
      return (nft.nftInfo as MaterialNft).name;
    } else if (nft.type === "blueprint") {
      return `[${(nft.nftInfo as BlueprintOrPuzzleNft).seasonName}] 
        설계도면(${(nft.nftInfo as BlueprintOrPuzzleNft).zoneName})`;
    } else {
      return `[${(nft.nftInfo as BlueprintOrPuzzleNft).seasonName}]
      조각(${(nft.nftInfo as BlueprintOrPuzzleNft).zoneName})`;
    }
  };

  return (
    <div className="DrThree">
      <p className="dr_title">NFT 교환 제안</p>
      <div className="dr_stepbar">
        <div className="container">
          <div className="filler" style={fillerStyles}></div>
        </div>
        <p>3단계: 제안 검토 및 생성</p>
      </div>
      <div className="exchangeNfts_main">
        <div className="offerNft">
          <p className="enTxt">제공할 NFT:</p>
          {selectedOfferNfts.map((nft, index) => (
            <p key={index}>
              {setNftName(nft)} (수량: {nft.quantity})
            </p>
          ))}
        </div>
        <div className="requestNft">
          <p className="enTxt">받고 싶은 NFT:</p>
          {selectedRequestNfts.map((nft, index) => (
            <p key={index}>
              {setNftName(nft)} (수량: {nft.quantity})
            </p>
          ))}
        </div>
      </div>
      <div className="dr3Buttons">
        <button className="dr3_btn back" onClick={() => navigate(-1)}>
          이전
        </button>
        <button className="dr3_btn exchange" onClick={nftExchange}>
          완료
        </button>
      </div>
      {showAlertModal && (
        <AlertModal
          isOpen={showAlertModal}
          content={modalContent}
          onConfirm={handleAlertModalClose}
        />
      )}
    </div>
  );
}

export default DrThree;
