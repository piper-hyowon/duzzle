import React from "react";
import { NftExchangeOfferStatus } from "../../Data/DTOs/Deal";

interface SearchSectionProps {
  searchParams: {
    user: string;
    providedNft: string;
    requestedNft: string;
  };
  setSearchParams: React.Dispatch<
    React.SetStateAction<{
      user: string;
      providedNft: string;
      requestedNft: string;
    }>
  >;
  handleSearch: () => void;
  handleStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  status: NftExchangeOfferStatus;
  handleNewTrade: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchParams,
  setSearchParams,
  handleSearch,
  handleStatusChange,
  status,
  handleNewTrade,
}) => {
  return (
    <div className="search-section">
      <input
        type="text"
        placeholder="등록 유저 검색..."
        value={searchParams.user}
        onChange={(e) =>
          setSearchParams({ ...searchParams, user: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="제공 NFT 검색..."
        value={searchParams.providedNft}
        onChange={(e) =>
          setSearchParams({ ...searchParams, providedNft: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="요청 NFT 검색..."
        value={searchParams.requestedNft}
        onChange={(e) =>
          setSearchParams({ ...searchParams, requestedNft: e.target.value })
        }
      />
      <button onClick={handleSearch}>🔍 검색</button>
      <button onClick={handleNewTrade}>+ 새 거래</button>
      <select value={status} onChange={handleStatusChange}>
        <option value="">상태</option>
        <option value="listed">대기중</option>
        <option value="completed">거래완료</option>
        <option value="system_cancelled">거래취소</option>
      </select>
    </div>
  );
};

export default SearchSection;
