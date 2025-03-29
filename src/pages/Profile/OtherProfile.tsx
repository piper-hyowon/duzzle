import "./OtherProfile.css";
import axios from "axios";
import { useState, useEffect } from "react";
import MyHeader from "../../components/MyHeader/MyHeader";
import MyButton from "../../components/MyButton/MyButton";
import { useParams } from "react-router-dom";
import { OtherUserDto } from "../../Data/DTOs/OtherUserDTO";

const RequestURL = import.meta.env.VITE_REQUEST_URL;

function OtherProfile() {
  const [User, setUser] = useState<OtherUserDto>({
    name: "",
    image: "",
    walletAddress: "",
    history: [{ rankedFirst: 0, rankedThird: 0, questStreak: 0 }],
    items: [{ count: 0, name: "", image: "" }],
    puzzles: [{ zone: "", image: "", season: "" }],
  });
  const { walletAddress } = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          RequestURL + `/v1/user/${walletAddress}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data.data);
        setUser(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, [walletAddress]);

  // 사용자 지갑 주소 중간 생략
  const WalletComponent: React.FC<{ wallet: string }> = ({ wallet }) => {
    const { start, end } = truncateWallet(wallet);

    return (
      <>
        <span>{start}</span>
        <span>...</span>
        <span>{end}</span>
      </>
    );
  };

  const truncateWallet = (wallet: string): { start: string; end: string } => {
    const start = wallet.slice(0, 6);
    const end = wallet.slice(-4);
    return { start, end };
  };

  return (
    <div className="OtherProfile">
      <MyHeader headerText="프로필" leftChild={<MyButton />} />
      <div className="profile_title">
        <p>사용자 정보</p>
      </div>
      <div className="profile_img">
        <img src={User.image} />
      </div>
      <div className="profile_list">
        <div className="profile_info">
          <div className="profile_name">
            <p className="list_name">이름(닉네임)</p>
            <div className="name">
              <p>{User.name || "Unknown"}</p>
            </div>
          </div>
          <div className="profile_wallet">
            <p className="list_name">지갑 주소</p>
            <div className="wallet">
              <p>
                <WalletComponent wallet={User.walletAddress} />
              </p>
            </div>
          </div>
        </div>
        <section>
          <div className="profile_record">
            <p className="list_name">업적</p>
            <div className="record">
              <p className="record_title_1">시즌 랭킹 1위:</p>
              <p className="record_number_1">{User.history["rankedFirst"]}</p>
            </div>
            <div className="record">
              <p className="record_title">시즌 랭킹 상위 3위:</p>
              <p className="record_number">{User.history["rankedThird"]}</p>
            </div>
            <div className="record">
              <p className="record_title">시즌 랭킹 퀘스트 연승:</p>
              <p className="record_number">{User.history["questStreak"]}</p>
            </div>
          </div>
        </section>
        <section>
          <div className="profile_nft">
            <p className="list_name">보유 아이템 NFT</p>
            <div className="items">
              {User.items && User.items.length > 0 ? (
                User.items.map((item) => (
                  <div className="item" key={item.name}>
                    <img src={item.image} alt={item.name} />
                    <p>{item.name}</p>
                    <p>{item.count}개</p>
                  </div>
                ))
              ) : (
                <p>아이템이 없습니다.</p>
              )}
            </div>
          </div>
        </section>
        <section>
          <div className="profile_nft">
            <p className="list_name">보유 조각 NFT</p>
            <div className="puzzles">
              {User.puzzles.map((puzzle) => (
                <div className="puzzle" key={`${puzzle.season + puzzle.zone}`}>
                  <img
                    src={puzzle.image}
                    alt={`${puzzle.season + puzzle.zone}`}
                  />
                  <p
                    className="puzzle-text"
                    title={`[${puzzle.season}] ${puzzle.zone}`}
                  >
                    {`[${puzzle.season}] ${puzzle.zone}`}
                  </p>{" "}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default OtherProfile;
