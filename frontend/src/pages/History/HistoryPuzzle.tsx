import "./HistoryPuzzle.css";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import MyHeader from "../../components/MyHeader/MyHeader";
import MyButton from "../../components/MyButton/MyButton";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Minted, PieceDto } from "../../Data/DTOs/PieceDTO";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Modal from "react-modal";

// 이미지
import mainImg from "../../assets/images/mainImg.png";
import ThreeDScene from "../../components/3dModel/ThreeDScene";

function HistoryPuzzle() {
  const navigate = useNavigate();
  const { seasonId } = useParams();
  const RequestUrl = import.meta.env.VITE_REQUEST_URL;

  const location = useLocation();
  const { seasonTitle } = (location.state || {}) as { seasonTitle?: string };

  const [scale, setScale] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [pieces, setPieces] = useState<PieceDto[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<PieceDto | null>(null);
  const [totalPieces, setTotalPieces] = useState(0);
  const [mintedPieces, setMintedPieces] = useState(0);

  const goToNFTDetail = () => {
    navigate("/nft-detail", { state: { data: selectedPiece } });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          RequestUrl + "/v1/season-history/puzzle",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
            params: { seasonId: seasonId },
          }
        );
        if (response.data.result) {
          //console.log(response.data.data);
          setPieces(response.data.data.pieces);
          setTotalPieces(response.data.data.total);
          setMintedPieces(response.data.data.minted);
        } else {
          console.error("Failed to fetch puzzles");
        }
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, [RequestUrl, seasonId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleScaleChange(event: any) {
    setScale(event.instance.transformState.scale);
  }

  // 발행된 조각 모달창
  const openModal = useCallback((piece: PieceDto) => {
    if (!piece.minted) return;
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
      backgroundColor: "#f4f1e3",
      boxShadow: "3px 3px 3px 3px rgba(0,0,0,0.25)",
      overflow: "hidden",
    },
  };

  // NFT 민트 현황
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

  return (
    <div className="HistoryPuzzle">
      <MyHeader headerText="히스토리" leftChild={<MyButton />} />
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
                      left: `${piece.coordinates.split(",")[0]}%`,
                      top: `${piece.coordinates.split(",")[1]}%`,
                      transform: `scale(${1 / scale})`,
                      backgroundColor: piece.minted ? "#f47735" : "#8C8C8C",
                      cursor: piece.minted ? "pointer" : "grab",
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
                    <div className="modal_mintedO">
                      <div className="mintedO_piece">
                        <p className="info_title">NFT 컬렉션</p>
                        <p className="info">{seasonTitle}</p>
                        <p className="info_title">조각 아이디</p>
                        <p className="info">{selectedPiece.pieceId}</p>
                        <p className="info_title">토큰 소유자</p>
                        <p className="info owner">
                          {(selectedPiece.data as Minted).owner.name}
                        </p>
                        <p className="info wallet">
                          <WalletComponent
                            wallet={
                              (selectedPiece.data as Minted).owner.walletAddress
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
                        )}{" "}
                      </div>
                    </div>
                  </Modal>
                )}
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
}

export default HistoryPuzzle;
