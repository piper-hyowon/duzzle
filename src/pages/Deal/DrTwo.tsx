import "./DrTwo.css";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  AvailableNft,
  BlueprintOrPuzzleNft,
  MaterialNft,
} from "../../Data/DTOs/DealNftDTO";
import { useLocation, useNavigate } from "react-router-dom";

function DrTwo() {
  const navigate = useNavigate();
  const RequestUrl = import.meta.env.VITE_REQUEST_URL;

  const selectedOfferNfts = useLocation().state;

  const [nftsRequest, setNftsRequest] = useState<AvailableNft[]>([]);
  const [selectedRequestNfts, setSelectedRequestNfts] = useState<
    AvailableNft[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");

  const fillerStyles = {
    width: `66.6%`,
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = {
          count: 50,
          page: 0,
        };
        if (search) {
          params.name = search;
        }
        const responseRequest = await axios.get(
          `${RequestUrl}/v1/nft-exchange/available-nfts-to-request`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: params,
          }
        );

        if (responseRequest.data.result) {
          //console.log("Response nftRequest", responseRequest.data.data);
          const updatedNftsRequest = responseRequest.data.data.list.map(
            (nft: AvailableNft) => ({
              ...nft,
              quantity: nft.nftInfo.availableQuantity,
            })
          );
          setNftsRequest(updatedNftsRequest);
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [RequestUrl, search]);

  const onSearch = () => {
    setSearch(searchTerm);
  };

  const handleRequestNftClick = (nft: AvailableNft) => {
    setSelectedRequestNfts((prevSelected) =>
      prevSelected.includes(nft)
        ? prevSelected.filter((selectedNft) => selectedNft !== nft)
        : [...prevSelected, nft]
    );
  };

  const updateQuantity = (nft: AvailableNft, newQuantity: number) => {
    setNftsRequest((prevNftsRequest) =>
      prevNftsRequest.map((item) =>
        item === nft ? { ...item, quantity: newQuantity } : item
      )
    );
    setSelectedRequestNfts((prevSelected) =>
      prevSelected.map((item) =>
        item === nft ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const increaseQuantity = (nft: AvailableNft) => {
    const newQuantity = Math.min(
      nft.quantity + 1,
      nft.nftInfo.availableQuantity
    );
    updateQuantity(nft, newQuantity);
  };

  const decreaseQuantity = (nft: AvailableNft) => {
    const newQuantity = Math.max(nft.quantity - 1, 1);
    updateQuantity(nft, newQuantity);
  };

  const renderNfts = (
    nfts: AvailableNft[],
    selectedNfts: AvailableNft[],
    handleClick: (nft: AvailableNft) => void
  ) => {
    return nfts.map((nft, index) => {
      const isSelected = selectedNfts.includes(nft);
      return (
        <div
          key={index}
          className={`request-nft ${isSelected ? "selected" : ""}`}
          onClick={() => handleClick(nft)}
        >
          <div className="rn-img">
            <img src={nft.nftInfo.imageUrl} />
          </div>
          <div className="rn-info">
            <p>{setNftName(nft)}</p>
            <div className="quantity-controls">
              <span>수량: {nft.quantity}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  decreaseQuantity(nft);
                }}
                disabled={isSelected}
                className={isSelected ? "disabled" : ""}
              >
                -
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  increaseQuantity(nft);
                }}
                disabled={isSelected}
                className={isSelected ? "disabled" : ""}
              >
                +
              </button>
            </div>
          </div>
        </div>
      );
    });
  };

  const setNftName = (nft: AvailableNft): string => {
    if (nft.type === "material") {
      return (nft.nftInfo as MaterialNft).name;
    } else {
      return `[${(nft.nftInfo as BlueprintOrPuzzleNft).seasonName}]
      ${(nft.nftInfo as BlueprintOrPuzzleNft).zoneName}`;
    }
  };

  const setNftName2 = (nft: AvailableNft): string => {
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
    <div className="DrTwo">
      <p className="dr_title">NFT 교환 제안</p>
      <div className="dr_stepbar">
        <div className="container">
          <div className="filler" style={fillerStyles}></div>
        </div>
        <p>2단계: 받고 싶은 NFT 선택</p>
      </div>
      <div className="rn-search">
        <textarea
          placeholder="NFT 검색.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={onSearch}>검색</button>
      </div>
      <div className="requestNfts_main">
        {renderNfts(nftsRequest, selectedRequestNfts, handleRequestNftClick)}
      </div>
      <div className="selected-nfts">
        <p className="snTxt">선택된 NFT:</p>
        {selectedRequestNfts.map((nft, index) => (
          <p key={index}>
            {index + 1}. {setNftName2(nft)} (수량: {nft.quantity})
          </p>
        ))}
      </div>
      <div className="dr2Buttons">
        <button className="dr2_btn back" onClick={() => navigate(-1)}>
          이전
        </button>
        <button
          className={`dr2_btn ${
            selectedRequestNfts.length > 0 ? "" : "disabled"
          }`}
          onClick={() =>
            navigate("/nft-exchange/regist/stepThree", {
              state: { selectedOfferNfts, selectedRequestNfts },
            })
          }
          disabled={selectedRequestNfts.length === 0}
        >
          선택 완료
        </button>
      </div>
    </div>
  );
}

export default DrTwo;
