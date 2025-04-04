import { useEffect, useState } from "react";
import MyButton from "../../components/MyButton/MyButton";
import MyHeader from "../../components/MyHeader/MyHeader";

import "./Pieces.css";
import { useNavigate } from "react-router-dom";
import { ZONES } from "../../util/zone";
import { mockApiService } from "../../services/mockServices";

function Pieces() {
  const navigate = useNavigate();
  const [totalPieces, setTotalPieces] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>([]);

  interface Piece {
    id: number;
    name: string;
    image: string;
    zoneKr: string;
    seasonKr: string;
    threeDModelUrl: string;
  }

  const [isSActive, setIsSActive] = useState(false);
  const [isZActive, setIsZActive] = useState(false);
  const [filterSeason, setFilterSeason] = useState("시즌 전체");
  const [filterZone, setFilterZone] = useState("구역 전체");

  const goToNFTDetail = async (pieceId: number) => {
    const response = mockApiService.myNft.puzzleDetail(pieceId);
    const data = {
      ...response,
      data: {
        ...response,
      },
    };
    navigate("/nft-detail", {
      state: {
        data,
      },
    });
  };

  useEffect(() => {
    const getUserPuzzle = async () => {
      const response = mockApiService.myNft.puzzleList();
      setTotalPieces(response.data.total);
      setPieces(response.data.list);
    };
    getUserPuzzle();
  }, []);

  const handleOptionClick = (option: string, filter: string) => {
    if (filter === "season") {
      setFilterSeason(option);
      setIsSActive(false);
    } else {
      setFilterZone(option);
      setIsZActive(false);
    }
  };

  const handleLabelClick =
    (filter: string): React.MouseEventHandler<HTMLButtonElement> =>
    () => {
      if (filter === "season") {
        setIsSActive((prevState) => !prevState);
      } else {
        setIsZActive((prevState) => !prevState);
      }
    };

  return (
    <div className="Pieces">
      <MyHeader headerText="퍼즐조각 NFT" leftChild={<MyButton />} />
      <div className="pieces_title">
        <p>나의 조각</p>
      </div>
      <div className="pieces_total">
        <img src="/assets/images/piece.png" />
        <p>{totalPieces} Pieces</p>
      </div>
      <div className="pieces_filter">
        <div className={`filter season ${isSActive ? "active" : ""}`}>
          <button className="label" onClick={handleLabelClick("season")}>
            {filterSeason}
            {isSActive ? (
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                ></path>
              </svg>
            ) : (
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                ></path>
              </svg>
            )}
          </button>
          <ul className="optionList">
            <li
              className="optionItem"
              onClick={() => handleOptionClick("시즌 전체", "season")}
            >
              시즌 전체
            </li>
            {[
              {
                title: "2024 Christmas",
                titleKr: "2024 크리스마스",
              },
              {
                title: "2024 Spring",
                titleKr: "2024 봄",
              },
              {
                title: " Halloween",
                titleKr: "할로윈",
              },
            ].map((season) => (
              <li
                className="optionItem"
                key={season.title}
                onClick={() => handleOptionClick(season.title, "season")}
              >
                {season.titleKr}
              </li>
            ))}
          </ul>
        </div>
        <div className={`filter zone ${isZActive ? "active" : ""}`}>
          <button className="label" onClick={handleLabelClick("zone")}>
            {filterZone}
            {isZActive ? (
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                ></path>
              </svg>
            ) : (
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                ></path>
              </svg>
            )}
          </button>
          <ul className="optionList">
            <li
              className="optionItem"
              onClick={() => handleOptionClick("구역 전체", "zone")}
            >
              구역 전체
            </li>
            {ZONES.map((zone) => (
              <li
                className="optionItem"
                key={zone.nameKr}
                onClick={() => handleOptionClick(zone.nameKr, "zone")}
              >
                {zone.nameKr}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="pieces_main">
        {pieces.map((piece) => (
          <div
            className="piece"
            key={piece.name}
            onClick={
              piece.threeDModelUrl ? () => goToNFTDetail(piece.id) : undefined
            }
            style={{
              cursor: piece.threeDModelUrl ? "pointer" : "default",
            }}
          >
            <img src={piece.image} alt={piece.name} />
            <p>{piece.name}</p>
            <span className="tooltip_text">
              시즌: {piece.seasonKr}
              <br></br> 구역: {piece.zoneKr}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pieces;
