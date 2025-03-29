import "./Mainpage.css";
import mainImg from "/src/assets/images/mainImg_christmas.png";
import React, { useCallback, useEffect, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import Modal from "react-modal";
import { PieceDto, Minted, Unminted } from "../../Data/DTOs/PieceDTO";
import axios, { isAxiosError } from "axios";
import { seasonList } from "../../util/season";
import { useAuth } from "../../services/AuthContext";
import RPC from "../../../ethersRPC";
import { IProvider } from "@web3auth/base";
import { useNavigate } from "react-router-dom";
import ThreeDScene from "../../components/3dModel/ThreeDScene";
import AlertModal from "../../components/Modal/AlertModal";
import Loading from "../../components/Loading/Loading";

function Mainpage() {
  const navigate = useNavigate();
  const { web3auth } = useAuth();
  const [scale, setScale] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [pieces, setPieces] = useState<PieceDto[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<PieceDto | null>(null);
  const [totalPieces, setTotalPieces] = useState(0);
  const [mintedPieces, setMintedPieces] = useState(0);
  const RequestUrl = import.meta.env.VITE_REQUEST_URL;
  const seasonId = seasonList[seasonList.length - 1].id;
  const seasonName = seasonList[seasonList.length - 1].title;
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPuzzle = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          RequestUrl + `/v1/puzzle/${seasonId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data.result) {
          const pieceData = response.data.data.pieces;
          setPieces(pieceData);
          setTotalPieces(response.data.data.total);
          setMintedPieces(response.data.data.minted);
        } else {
          console.error("Failed to fetch pieces");
        }
      } catch (error) {
        console.error(error);
      }
    };
    getPuzzle();
  }, [RequestUrl, seasonId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleScaleChange(event: any) {
    setScale(event.instance.transformState.scale);
  }

  const openModal = useCallback((piece: PieceDto) => {
    setSelectedPiece(piece);
    setModalOpen(true);
  }, []);

  function closeModal() {
    setModalOpen(false);
    setSelectedPiece(null);
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "65vw",
      maxWidth: "300px",
      height: "60vh",
      borderRadius: "20px",
      justifyContent: "center",
      backgroundColor: "#80DAE6",
      boxShadow: "3px 3px 3px 3px rgba(0,0,0,0.25)",
      overflow: "hidden",
      zIndex: "2",
    },
  };

  const goToNFTDetail = () => {
    navigate("nft-detail", { state: { data: selectedPiece } });
  };

  const unlockPuzzlePiece = async (pieceId: number) => {
    setLoading(true);
    const rpc = new RPC(web3auth?.provider as IProvider);
    try {
      const pieceMetadataUrl = await rpc.unlockPuzzlePiece(pieceId);
      //console.log(pieceMetadataUrl);
      setLoading(false);
      setModalOpen(false);
      openAlertModal("조각NFT 발행을 성공하였습니다.");
    } catch (error) {
      console.log(error);
      setLoading(false);
      setModalOpen(false);
      openAlertModal("재료가 부족합니다.");
    }
  };

  const visitProfile = async (walletAddress: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        RequestUrl + `/v1/user/${walletAddress}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.result) {
        navigate(`profile/${walletAddress}`);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response.data.code == "LOGIN_REQUIRED") {
          openAlertModal("해당 사용자 프로필을 보려면 로그인이 필요합니다.");
        } else if (error.response.data.code == "ACCESS_DENIED") {
          openAlertModal("해당 사용자가 프로필 공개를 거부했습니다.");
        } else if (error.response.data.code == "CONTENT_NOT_FOUND")
          openAlertModal("해당 사용자가 존재하지 않습니다.");
      }
    }
  };

  const fillerStyles = {
    width: `${(mintedPieces / totalPieces) * 100}%`,
  };

  // 사용자 지갑 주소 중간 생략
  const WalletComponent: React.FC<{ wallet: string }> = ({ wallet }) => {
    const { start, end } = truncateWallet(wallet);

    return (
      <>
        <span>({start}</span>
        <span>...</span>
        <span>{end})</span>
      </>
    );
  };

  const truncateWallet = (wallet: string): { start: string; end: string } => {
    const start = wallet.slice(0, 6);
    const end = wallet.slice(-4);
    return { start, end };
  };

  // 알림모달
  const openAlertModal = (content: string) => {
    setModalContent(content);
    setShowAlertModal(true);
  };
  const handleAlertModalClose = () => {
    setShowAlertModal(false);
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
    <div className="Mainpage">
      <div className="mainImg">
        <TransformWrapper
          initialScale={1}
          initialPositionX={-170}
          initialPositionY={0}
          centerOnInit
          onTransformed={(e) => handleScaleChange(e)}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <React.Fragment>
              <div className="minted_pieces">
                <div className="container">
                  <div className="filler" style={fillerStyles}></div>
                </div>
                <p>
                  발행된 NFT: {mintedPieces} / {totalPieces} <br />
                  남은 NFT: {totalPieces - mintedPieces}
                </p>
              </div>
              <div className="tools">
                <button onClick={() => zoomIn()}>
                  <svg
                    data-slot="icon"
                    fill="none"
                    strokeWidth="2.5"
                    stroke="white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    ></path>
                  </svg>
                </button>
                <button onClick={() => zoomOut()}>
                  <svg
                    data-slot="icon"
                    fill="none"
                    strokeWidth="2.5"
                    stroke="white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14"
                    ></path>
                  </svg>
                </button>
                <button onClick={() => resetTransform()}>RESET</button>
              </div>
              <TransformComponent>
                <img src={mainImg} />
                {pieces.map((piece) => (
                  <div
                    className="piece"
                    onClick={() => openModal(piece)}
                    key={piece.pieceId}
                    style={{
                      left: `${
                        parseFloat(piece.coordinates.split(",")[0]) * 0.115
                      }%`,
                      top: `${
                        parseFloat(piece.coordinates.split(",")[1]) * 0.155
                      }%`,
                      transform: `scale(${1 / scale})`,
                      backgroundColor: piece.minted ? "#f47735" : "#8C8C8C",
                    }}
                  >
                    {piece.zoneNameKr}
                  </div>
                ))}
                {selectedPiece && (
                  <Modal
                    isOpen={modalOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    shouldCloseOnOverlayClick={false}
                    ariaHideApp={false}
                  >
                    {selectedPiece.minted ? (
                      <div className="modal_mintedO">
                        <div className="mintedO_piece">
                          <p className="info_title">NFT 컬렉션</p>
                          <p className="info">{seasonName}</p>
                          <p className="info_title">조각 아이디</p>
                          <p className="info">{selectedPiece.pieceId}</p>
                          <p className="info_title">토큰 소유자</p>
                          <p
                            id="owner"
                            className="info owner"
                            onClick={() =>
                              visitProfile(
                                (selectedPiece.data as Minted).owner
                                  .walletAddress
                              )
                            }
                          >
                            {(selectedPiece.data as Minted).owner.name}
                            <span className="tooltip_text">
                              사용자 프로필 보기
                            </span>
                          </p>
                          <p className="info wallet">
                            <WalletComponent
                              wallet={
                                (selectedPiece.data as Minted).owner
                                  .walletAddress
                              }
                            />
                          </p>
                          {(selectedPiece.data as Minted).threeDModelUrl ? (
                            <div className="piece_3d">
                              <ThreeDScene
                                width="100%"
                                height="300px"
                                url={
                                  (selectedPiece.data as Minted).threeDModelUrl
                                }
                                isModal={true}
                              />
                            </div>
                          ) : (
                            <div className="piece_img">
                              <img
                                src={
                                  (selectedPiece.data as Minted).nftThumbnailUrl
                                }
                              ></img>
                            </div>
                          )}
                        </div>
                        <div className="mintedO_btn">
                          <button onClick={closeModal}>닫기</button>
                          {(selectedPiece.data as Minted).threeDModelUrl ? (
                            <button onClick={() => goToNFTDetail()}>
                              NFT 상세
                            </button>
                          ) : (
                            <button
                              disabled
                              style={{
                                backgroundColor: "gray",
                                cursor: "not-allowed",
                              }}
                            >
                              NFT 상세
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="modal_mintedX">
                        <div className="mintedX_piece">
                          <p className="info_title">NFT 컬렉션</p>
                          <p className="info">{seasonName}</p>
                          <p className="info_title">조각 위치</p>
                          <p className="info">{selectedPiece.zoneNameKr}</p>
                          <p className="info_title">재료</p>
                          {(selectedPiece.data as Unminted).requiredItems.map(
                            (item, index) => (
                              <div className="required_items" key={index}>
                                <img src={item.image} />
                                <p className="info items">
                                  {item.name} X {item.count}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                        <div className="mintedX_btn">
                          <button onClick={closeModal}>닫기</button>
                          <button
                            onClick={() => {
                              unlockPuzzlePiece(selectedPiece.pieceId);
                            }}
                          >
                            NFT 발행하기
                          </button>
                        </div>
                      </div>
                    )}
                    <Modal
                      isOpen={loading}
                      style={customLoadingModalStyles}
                      shouldCloseOnOverlayClick={false}
                      ariaHideApp={false}
                    >
                      <Loading />
                    </Modal>
                  </Modal>
                )}
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
      </div>
      <MyBottomNavBar />
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

export default Mainpage;
