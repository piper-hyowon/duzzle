import { useState, useEffect, useCallback } from "react";
import "./Deal.css";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import { useNavigate } from "react-router-dom";
import { DealApis, GetDealQueryParams } from "../../services/api/deal.api";
import { Deal, NftExchangeOfferStatus } from "../../Data/DTOs/Deal";
import DealList from "./DealList";
import SearchSection from "./SearchSectionComponent";
import { useAuth } from "../../services/AuthContext";
import LoginModal from "../../components/Modal/LoginModal";
import ApprovalManager from "./ApprovalManager";
interface SearchParams {
  user: string;
  providedNft: string;
  requestedNft: string;
}

const DealPage = () => {
  const { web3auth, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showApprovalManager, setShowApprovalManager] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [registeredTrades, setRegisteredTrades] = useState<Deal[]>([]);
  const [registeredTradesTotal, setRegisteredTradesTotal] = useState(0);
  const [myTrades, setMyTrades] = useState<Deal[]>([]);
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
    //console.log("isAuthenticated: ", isAuthenticated);
    if (isAuthenticated) {
      setShowApprovalManager(true);
    } else {
      //console.log("isAuthenticated: ", isAuthenticated);
      setShowLoginModal(true);
    }
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
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
        const params: GetDealQueryParams = {
          count: tradesPerPage,
          page: (isMyTrades ? myCurrentPage : currentPage) - 1,
          status,
          requestedNfts: searchParams.requestedNft,
          offeredNfts: searchParams.providedNft,
          offerorUser: searchParams.user,
        };

        const response =
          isMyTrades && isAuthenticated
            ? await DealApis.getMyOffers(params)
            : await DealApis.getNftExchangeOffers(params);

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
          web3auth={web3auth}
          onAllApproved={handleAllApproved}
          onCancel={handleApprovalCancel}
        />
      )}
      <LoginModal
        isOpen={showLoginModal}
        content="거래를 등록하려면 로그인이 필요합니다."
        onClose={handleLoginModalClose}
        onLogin={() => {
          navigate("/login");
          setShowLoginModal(false);
          setShowApprovalManager(true);
        }}
      />
    </div>
  );
};

export default DealPage;
