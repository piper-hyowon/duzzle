import "./DrThree.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AvailableNft,
  MaterialNft,
  BlueprintOrPuzzleNft,
} from "../../Data/DTOs/DealNftDTO";

function DrThree() {
  const navigate = useNavigate();
  const RequestUrl = import.meta.env.VITE_REQUEST_URL;

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

  const nftExchange = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const params = {
        offeredNfts: selectedOfferNfts.map(NftInfo),
        requestedNfts: selectedRequestNfts.map(NftInfo),
      };
      const response = await axios.post(
        `${RequestUrl}/v1/nft-exchange/register`,
        params,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.result) {
        //console.log(response.data);
        navigate("/nft-exchange");
      } else {
        console.log("Exchange failed");
      }
    } catch (error) {
      console.error("Error during exchange:", error);
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
    </div>
  );
}

export default DrThree;
