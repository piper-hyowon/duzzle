import { useEffect, useState } from "react";
import MyButton from "../../components/MyButton/MyButton";
import MyHeader from "../../components/MyHeader/MyHeader";

import "./Pieces.css";
import axios from "axios";
import { zoneList } from "../../util/zone";
import { seasonList } from "../../util/season";
import { useNavigate } from "react-router-dom";

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

  const RequestUrl = import.meta.env.VITE_REQUEST_URL;

  const [isSActive, setIsSActive] = useState(false);
  const [isZActive, setIsZActive] = useState(false);
  const [filterSeason, setFilterSeason] = useState("시즌 전체");
  const [filterZone, setFilterZone] = useState("구역 전체");

  const goToNFTDetail = async (pieceId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const response = await axios.get(
          `${RequestUrl}/v1/my/nft-puzzles/${pieceId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        console.log(response.data);

        if (response.data.result) {
          navigate("/nft-detail", {
            state: {
              data: response.data,
            },
          });
        } else {
          console.error("Failed to fetch piece detail");
        }
      } else {
        throw new Error("No access token");
      }
    } catch (error) {
      console.error("Error fetching piece detail:", error);
    }
  };

  useEffect(() => {
    const getUserPuzzle = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const season =
          filterSeason !== "시즌 전체"
            ? seasonList.find((season) => season.title === filterSeason)
            : null;
        const zone =
          filterZone !== "구역 전체"
            ? zoneList.find((zone) => zone.nameKr === filterZone)
            : null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = {
          count: 20,
          page: 0,
        };
        if (season) {
          params.season = season.id;
        }
        if (zone) {
          params.zone = zone.id;
        }
        const response = await axios.get(RequestUrl + "/v1/my/nft-puzzles", {
          headers: {
            Authorization: "Bearer " + token,
          },
          params: params,
        });
        if (response.data.result) {
          setTotalPieces(response.data.data.total);
          setPieces(response.data.data.list);
          console.log(pieces);
        } else {
          console.error("Failed to fetch pieces");
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUserPuzzle();
  }, [RequestUrl, filterSeason, filterZone]);

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
        <img src="/src/assets/images/piece.png" />
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
            {seasonList.map((season) => (
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
            {zoneList.map((zone) => (
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
