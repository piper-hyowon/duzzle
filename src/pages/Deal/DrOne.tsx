import "./DrOne.css";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  AvailableNft,
  BlueprintOrPuzzleNft,
  MaterialNft,
} from "../../Data/DTOs/DealNftDTO";
import { useNavigate } from "react-router-dom";
import MyButton from "../../components/MyButton/MyButton";
import MyHeader from "../../components/MyHeader/MyHeader";

function DrOne() {
  const navigate = useNavigate();
  const RequestUrl = import.meta.env.VITE_REQUEST_URL;

  const [nftsOffer, setNftsOffer] = useState<AvailableNft[]>([]);
  const [selectedOfferNfts, setSelectedOfferNfts] = useState<AvailableNft[]>(
    []
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const responseOffer = await axios.get(
          `${RequestUrl}/v1/nft-exchange/available-nfts-to-offer`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (responseOffer.data.result) {
          //console.log("Response nftOffer", responseOffer.data.data);
          const updatedNftsOffer = responseOffer.data.data.list.map(
            (nft: AvailableNft) => ({
              ...nft,
              quantity: nft.nftInfo.availableQuantity,
            })
          );
          setNftsOffer(updatedNftsOffer);
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [RequestUrl]);

  const fillerStyles = {
    width: `33.3%`,
  };

  const handleOfferNftClick = (nft: AvailableNft) => {
    setSelectedOfferNfts((prevSelected) =>
      prevSelected.includes(nft)
        ? prevSelected.filter((selectedNft) => selectedNft !== nft)
        : [...prevSelected, nft]
    );
  };

  const updateQuantity = (nft: AvailableNft, newQuantity: number) => {
    setNftsOffer((prevNftsOffer) =>
      prevNftsOffer.map((item) =>
        item === nft ? { ...item, quantity: newQuantity } : item
      )
    );
    setSelectedOfferNfts((prevSelected) =>
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
          className={`offer-nft ${isSelected ? "selected" : ""}`}
          onClick={() => handleClick(nft)}
        >
          <img src={nft.nftInfo.imageUrl} />
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

  const BackButton = () => {
    return (
      <button className="back-button" onClick={() => navigate("/nft-exchange")}>
        <svg
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
          ></path>
        </svg>
      </button>
    );
  };

  return (
    <div className="DrOne">
      <MyHeader headerText="NFT 교환 제안" leftChild={<BackButton />} />
      <div className="dr_stepbar">
        <div className="container">
          <div className="filler" style={fillerStyles}></div>
        </div>
        <p>1단계: 제공할 NFT 선택</p>
      </div>
      <div className="offerNfts_main">
        {renderNfts(nftsOffer, selectedOfferNfts, handleOfferNftClick)}
      </div>
      <div className="selected-nfts">
        <p className="snTxt">선택된 NFT:</p>
        {selectedOfferNfts.map((nft, index) => (
          <p key={index}>
            {index + 1}. {setNftName2(nft)} (수량: {nft.quantity})
          </p>
        ))}
      </div>
      <button
        className={`dr1_btn ${selectedOfferNfts.length > 0 ? "" : "disabled"}`}
        onClick={() =>
          navigate("/nft-exchange/regist/stepTwo", { state: selectedOfferNfts })
        }
        disabled={selectedOfferNfts.length === 0}
      >
        다음: 받고 싶은 NFT 선택
      </button>
    </div>
  );
}

export default DrOne;
