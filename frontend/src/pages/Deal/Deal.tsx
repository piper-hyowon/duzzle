import { useState, useEffect, useCallback } from "react";
import "./Deal.css";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import { useNavigate } from "react-router-dom";
import DealList from "./DealList";
import SearchSection from "./SearchSectionComponent";
import ApprovalManager from "./ApprovalManager";
import { mockApiService } from "../../services/mockServices";
import {
  NftExchangeListRequest,
  NftExchangeOfferResponse,
  NftExchangeOfferStatus,
} from "../../services/type";
interface SearchParams {
  user: string;
  providedNft: string;
  requestedNft: string;
}

const DealPage = () => {
  const navigate = useNavigate();
  const [showApprovalManager, setShowApprovalManager] = useState(false);
  const [registeredTrades, setRegisteredTrades] = useState<
    NftExchangeOfferResponse[]
  >([]);
  const [registeredTradesTotal, setRegisteredTradesTotal] = useState(0);
  const [myTrades, setMyTrades] = useState<NftExchangeOfferResponse[]>([]);
  const [myTradesTotal, setMyTradesTotal] = useState(0);
  const [status, setStatus] = useState<NftExchangeOfferStatus>(undefined);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    user: "",
    providedNft: "",
    requestedNft: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [myCurrentPage, setMyCurrentPage] = useState(1);
  const tradesPerPage = 2;

  const handleNewTrade = () => {
    setShowApprovalManager(true);
  };

  const handleAllApproved = () => {
    navigate("/nft-exchange/regist/stepOne");
  };

  const handleApprovalCancel = () => {
    setShowApprovalManager(false);
  };

  const fetchTrades = useCallback(
    async (isMyTrades: boolean) => {
      try {
        const params: NftExchangeListRequest = {
          count: tradesPerPage,
          page: (isMyTrades ? myCurrentPage : currentPage) - 1,
          status,
          requestedNfts: searchParams.requestedNft,
          offeredNfts: searchParams.providedNft,
          offerorUser: searchParams.user,
        };

        const response = isMyTrades
          ? mockApiService.nftExchange.my({
              count: 0,
              page: 0,
            }).data
          : mockApiService.nftExchange.my({ count: 0, page: 0 }).data;

        if (isMyTrades) {
          setMyTrades(response.list);
          setMyTradesTotal(
            Math.max(Math.ceil(response.total / tradesPerPage), 1)
          );
        } else {
          setRegisteredTrades(response.list);
          setRegisteredTradesTotal(
            Math.max(Math.ceil(response.total / tradesPerPage), 1)
          );
        }
      } catch (error) {
        console.error(
          `Error fetching ${isMyTrades ? "my " : ""}trades:`,
          error
        );
      }
    },
    [currentPage, myCurrentPage, status, searchParams]
  );

  useEffect(() => {
    fetchTrades(false);
    fetchTrades(true);
  }, [fetchTrades]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setMyCurrentPage(1);
  };
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="Deal">
      <SearchSection
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        handleSearch={handleSearch}
        handleStatusChange={handleStatusChange}
        status={status}
        handleNewTrade={handleNewTrade}
      />
      <div>
        <button
          className="but1"
          onClick={() => scrollToSection("registeredTrade")}
        >
          등록된 거래 목록 보기
        </button>
        <button className="but2" onClick={() => scrollToSection("myTrade")}>
          내가 등록한 거래 보기
        </button>
      </div>

      <div className="con">
        <div id="registeredTrade">
          <DealList
            title="등록된 거래 목록"
            deals={registeredTrades}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={registeredTradesTotal}
          />
        </div>

        <div id="myTrade">
          <DealList
            title="내가 등록한 거래"
            deals={myTrades}
            currentPage={myCurrentPage}
            setCurrentPage={setMyCurrentPage}
            totalPages={myTradesTotal}
          />
        </div>
      </div>

      <MyBottomNavBar />
      {showApprovalManager && (
        <ApprovalManager
          onAllApproved={handleAllApproved}
          onCancel={handleApprovalCancel}
        />
      )}
    </div>
  );
};

export default DealPage;
