import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DealApis } from "../../services/api/deal.api";
import "./DealDetail.css";
import {
  Deal,
  ExchangeBlueprintOrPuzzleNFT,
  ExchangeMaterialNFT,
  NftExchangeOfferStatus,
} from "../../Data/DTOs/Deal";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import MyHeader from "../../components/MyHeader/MyHeader";
import MyButton from "../../components/MyButton/MyButton";
import ConfirmCancelModal from "../../components/Modal/ConfirmCancelModal";
import Modal from "react-modal";

const DealDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trade, setTrade] = useState<Deal | null>(null);
  const [isMine, setIsMine] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<boolean[]>([]);
  const [showCCModal, setShowCCModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const myWalletAddress = localStorage.getItem("walletAddress");

    const fetchDetail = async () => {
      try {
        setTrade({
          id: parseInt(id),
          offerorUser: {
            walletAddress: "",
            name: "",
            image: "",
          },
          requestedNfts: [],
          offeredNfts: [],
          status: NftExchangeOfferStatus.LISTED,
          createdAt: new Date(),
        });

        const response = await DealApis.getDetails(id);
        setTrade(response);
        setIsMine(
          myWalletAddress &&
            response.offerorUser.walletAddress === myWalletAddress
        );
        setShowHistory(new Array(response.offeredNfts.length).fill(false));
      } catch (error) {
        console.error("Error fetching trade details:", error);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  const handleToggleHistory = (index: number) => {
    setShowHistory((prevState) =>
      prevState.map((show, i) => (i === index ? !show : show))
    );
  };

  const handleAcceptExchange = async () => {
    setLoading(true);
    setError(null);
    try {
      await DealApis.acceptNftExchangeOffer(id);
      // 성공 처리 (예: 성공 메시지 표시, 페이지 리다이렉트 등)
      setLoading(false);
      navigate("/nft-exchange", {
        state: { message: "교환이 성공적으로 완료되었습니다." },
      });
    } catch (err) {
      setLoading(false);
      if (err.response) {
        const { status, data } = err.response;
        switch (status) {
          case 404:
            setError(`거래를 찾을 수 없습니다. (ID: ${id})`);
            break;
          case 400:
            if (data.code === "INSUFFICIENT_NFT") {
              setError(`NFT 부족: ${data.message}`);
            } else {
              setError("잘못된 요청입니다.");
            }
            break;
          case 409:
            setError(
              "거래 취소: 현재 제안자가 제안한 NFT를 보유하고 있지 않아 거래를 진행할 수 없습니다."
            );
            break;
          case 403:
            setError("자신이 등록한 교환 거래는 승인할 수 없습니다.");
            break;
          default:
            setError("알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.");
        }
      } else {
        setError(
          "네트워크 오류가 발생했습니다. 연결을 확인하고 다시 시도해 주세요."
        );
      }
    }
  };

  const handleCCModalClose = () => {
    setShowCCModal(false);
  };

  const handleButtonClick = async () => {
    if (isMine) {
      // 거래 취소 로직
      setShowCCModal(true);
    } else {
      handleAcceptExchange();
    }
  };

  const confirmAction = async () => {
    await DealApis.cancelNftExchangeOffer(id);
    navigate("/nft-exchange", {
      state: { message: "취소가 성공적으로 완료되었습니다." },
    });
    setShowCCModal(false);
  };

  if (!trade)
    return (
      <div className="nft-exchange-error">
        <MyHeader headerText="NFT 교환 상세" leftChild={<MyButton />} />
        <p>NFT 교환 정보를 불러올 수 없습니다.</p>
        <p>다시 시도해주세요.</p>
      </div>
    );

  const getSeasonEmoji = (seasonName: string) => {
    switch (seasonName) {
      case "봄":
        return "🌸";
      case "크리스마스":
        return "🎄";
      default:
        return "❤️";
    }
  };

  const renderNftName = (
    nft: ExchangeMaterialNFT | ExchangeBlueprintOrPuzzleNFT
  ) => {
    if (nft["seasonName"]) {
      return (
        <p>
          [{getSeasonEmoji(nft["seasonName"])}] {nft["zoneName"]}
        </p>
      );
    }
    return <p>{nft["name"]}</p>;
  };

  const renderTokenHistory = (
    nft: ExchangeMaterialNFT | ExchangeBlueprintOrPuzzleNFT
  ) => {
    return (
      <div className="history-container">
        <div className="history-header">
          <div className="history-column">Event</div>
          <div className="history-column">Date</div>
          <div className="history-column">From</div>
          <div className="history-column">To</div>
          <div className="history-column">Contract Link</div>
        </div>
        <div className="history-body">
          {nft.availableNfts.map((availableNft, i) =>
            availableNft.history.map((historyEntry, j) => (
              <div className="history-row" key={`${i}-${j}`}>
                <div className="history-column">{historyEntry.event}</div>
                <div className="history-column">
                  {historyEntry.date.split("T")[0]}
                </div>
                <div className="history-column">
                  {historyEntry.fromWalletAddress}
                </div>
                <div className="history-column">
                  {historyEntry.toWalletAddress}
                </div>
                <div className="history-column">
                  <a
                    href={historyEntry.blockExplorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    view more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // 로딩모달
  const customLoadingModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      width: "300px",
      height: "250px",
      borderRadius: "20px",
      justifyContent: "center",
      backgroundColor: "#F69EBB",
      boxShadow: "3px 3px 3px 3px rgba(0,0,0,0.25)",
    },
  };

  return (
    <div className="nft-exchange-detail">
      <MyHeader headerText="NFT 교환 상세" leftChild={<MyButton />} />
      <h3>제공 NFT</h3>
      <div className="nft-section">
        {trade.offeredNfts.map((nft, index) => (
          <>
            <div key={index} className="nft-item">
              <img src={nft.image} />
              <div className="nft-info">
                {renderNftName(nft)}
                <p className="nft-quantity">수량: {nft.quantity}개</p>
                {nft.availableNfts && (
                  <button onClick={() => handleToggleHistory(index)}>
                    {showHistory[index]
                      ? "▼ 히스토리 숨기기"
                      : "▶ 토큰 히스토리 보기"}
                  </button>
                )}
              </div>
            </div>
            {showHistory[index] && nft.availableNfts && (
              <div className="token-history">
                <h3>토큰 히스토리</h3>
                {renderTokenHistory(nft)}
              </div>
            )}
          </>
        ))}
      </div>
      <h3>요청 NFT</h3>
      <div className="nft-section">
        {trade.requestedNfts.map((nft, index) => (
          <div key={index} className="nft-item">
            <img src={nft.image} />
            <div className="nft-info">
              {renderNftName(nft)}
              <p className="nft-quantity">수량: {nft.quantity}개</p>
            </div>
          </div>
        ))}
      </div>
      <button
        className={isMine ? "action-button mine" : "action-button"}
        onClick={handleButtonClick}
      >
        {isMine ? "거래 취소하기" : "제안 수락하기"}
      </button>
      {error && <Error message={error} onClose={() => setError(null)} />}
      {showCCModal && (
        <ConfirmCancelModal
          isOpen={showCCModal}
          title="거래"
          content="거래를 취소하시겠습니까?"
          onConfirm={confirmAction}
          onCancel={handleCCModalClose}
        />
      )}
      <Modal
        isOpen={loading}
        style={customLoadingModalStyles}
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
      >
        <Loading />
      </Modal>
    </div>
  );
};

export default DealDetail;
