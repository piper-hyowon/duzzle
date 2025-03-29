/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Deal,
  ExchangeBlueprintOrPuzzleNFT,
  ExchangeMaterialNFT,
  NftExchangeOfferStatus,
} from "../../Data/DTOs/Deal";
import "./DealList.css";
import { useNavigate } from "react-router-dom";

interface DealListProps {
  title: string;
  deals: Deal[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const DealList: React.FC<DealListProps> = ({
  title,
  deals,
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const navigate = useNavigate();

  const handleDealClick = (id: number, status: string) => {
    if (status === "listed") {
      navigate(`/nft-exchange/${id}`);
    }
  };

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
        <p className="ree2">
          [{getSeasonEmoji(nft["seasonName"])}] {nft["zoneName"]} X{" "}
          {nft.quantity}
        </p>
      );
    }
    return <p className="ree2">{`${nft["name"]} X ${nft.quantity}`}</p>;
  };

  const getStatusText = (status: NftExchangeOfferStatus) => {
    switch (status) {
      case NftExchangeOfferStatus.LISTED:
        return "⏰ 거래 가능";
      case NftExchangeOfferStatus.COMPLETED:
        return "✓ 거래 완료";
      case NftExchangeOfferStatus.SYSTEM_CANCELLED:
        return "X 거래 취소";
      case NftExchangeOfferStatus.MATCHED:
      case NftExchangeOfferStatus.PENDING:
        return "⏳ 거래 중";
      default:
        return "⚠️ 거래 불가";
    }
  };

  const buttonsPerPage = 5;
  const [currentGroup, setCurrentGroup] = React.useState(0);

  const handleNextGroup = () => {
    if ((currentGroup + 1) * buttonsPerPage < totalPages) {
      setCurrentGroup(currentGroup + 1);
    }
  };

  const handlePrevGroup = () => {
    if (currentGroup > 0) {
      setCurrentGroup(currentGroup - 1);
    }
  };

  return (
    <div className="nft-exchange-list">
      <h3>{title}</h3>
      {deals && deals.length > 0 ? (
        deals.map((deal) => (
          <div
            key={deal.id}
            className="deal-item"
            onClick={() => handleDealClick(deal.id, deal.status)}
          >
            <div className="deal-content">
              <div className="user-info">
                <img src={deal.offerorUser.image} alt={deal.offerorUser.name} />
                <p className="userT">{deal.offerorUser.name || "이름 없음"}</p>
                <p className="userT1">
                  {new Date(deal.createdAt).toLocaleString().slice(0, 12)}
                </p>
              </div>
              <div className="speech-bubble">
                <div className={`status-badge ${deal.status}`}>
                  <p>{getStatusText(deal.status)}</p>
                </div>
                <div className="nft-info">
                  <p className="off1">바꿔요:</p>
                  <div className="offered">
                    {deal.offeredNfts.map((nft, index) => (
                      <div key={index} className="nft-item">
                        <img src={nft.image} />
                        {renderNftName(nft)}
                      </div>
                    ))}
                  </div>
                  <p className="ree1">주세요:</p>
                  <div className="requested">
                    {deal.requestedNfts.map((nft, index) => (
                      <div key={index} className="nft-item">
                        <img src={nft.image} />
                        {renderNftName(nft)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>등록된 거래가 없습니다.</p>
      )}

      <div className="pagination">
        {currentGroup > 0 && <button onClick={handlePrevGroup}>&lt; </button>}
        {[...Array(totalPages)]
          .slice(
            currentGroup * buttonsPerPage,
            (currentGroup + 1) * buttonsPerPage
          )
          .map((_, i) => {
            const pageNumber = currentGroup * buttonsPerPage + i + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={pageNumber === currentPage ? "active" : ""}
              >
                {pageNumber}
              </button>
            );
          })}
        {(currentGroup + 1) * buttonsPerPage < totalPages && (
          <button onClick={handleNextGroup}> &gt;</button>
        )}
      </div>
    </div>
  );
};

export default DealList;
