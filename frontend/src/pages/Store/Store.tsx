import { useEffect, useState } from "react";
import Modal from "react-modal";
import "./Store.css";

import RPC from "../../../ethersRPC";
import { itemList } from "../../util/item";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import MyBottomNavBar from "../../components/MyBottomNavBar/MyBottomNavBar";
import { useNavigate } from "react-router-dom";

function Store() {
  const navigate = useNavigate();
  const [userDal, setUserDal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [enoughDal, setEnoughDal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [curNFTItem, setCurNFTItem] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");

  const rpc = new RPC();

  const fetchUserDal = async () => {
    setTimeout(() => {
      setUserDal(Math.floor(Math.random() * 60) + 5);
    }, 500);
  };

  useEffect(() => {
    fetchUserDal();
  }, []);

  const getRandomItem = async () => {
    setLoading(true);
    try {
      const metadata = await rpc.getRandomItem((state) => {
        setLoadingMessage(state);
      });

      const foundNFTItem = itemList.find(
        (it) => it.metadata_name === metadata.name
      );

      if (foundNFTItem) {
        setCurNFTItem(foundNFTItem);
      } else {
        setCurNFTItem({
          metadata_name: metadata.name,
          item_name: metadata.name.split("#")[0],
          item_img: metadata.image,
        });
      }

      setUserDal((prevDal) => Math.max(0, prevDal - 2));
    } catch (error) {
      console.error(error);
      closeModal();
      setError(true);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  function buyItem() {
    if (error) {
      setError(false);
    }
    if (userDal >= 2) {
      setEnoughDal(true);
      getRandomItem();
    }
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
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
      height: "270px",
      borderRadius: "20px",
      justifyContent: "center",
      backgroundColor: "#F69EBB",
      boxShadow: "3px 3px 3px 3px rgba(0,0,0,0.25)",
    },
  };

  return (
    <div className="Store">
      <p className="store_title">상점</p>
      <div className="user_dal">
        <img src="/src/assets/images/moon.png" />
        <p>{userDal} Dal</p>
      </div>
      <div className="store_main">
        <button className="store_gift" onClick={buyItem}>
          <img src="/src/assets/images/gift.png" />
        </button>
        <div className="gift_dal">
          <img src="/src/assets/images/moon.png" />
          <p>2 Dal</p>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
      >
        {enoughDal ? (
          loading ? (
            <Loading message={loadingMessage} />
          ) : (
            <div className="modal_dalO">
              <div className="dal_btn_X">
                <button onClick={closeModal}>X</button>
              </div>
              <div className="dalO_p">
                <p>재료 NFT 구입 완료!</p>
              </div>
              <div className="dalO_item">
                <img src={curNFTItem?.item_img} />
                <p>{curNFTItem?.item_name}</p>
              </div>
              <div className="dalO_btn">
                <button onClick={() => navigate("/mypage")}>
                  보유 NFT 확인
                </button>
                <button onClick={() => navigate("/")}>
                  잠금해제<br></br> 하러 가기
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="modal_dalX">
            <div className="dal_btn_X">
              <button onClick={closeModal}>X</button>
            </div>
            <div className="dalX_p">
              <p>DAL 이 부족합니다!</p>
              <p>랜덤 퀘스트를 통해 DAL 을 </p>
              <p>획득해보세요.</p>
            </div>
            <div className="dalX_btn">
              <button
                onClick={() => {
                  navigate("/quest");
                }}
              >
                퀘스트 하러가기
              </button>
            </div>
          </div>
        )}
      </Modal>
      {error && (
        <Error
          message="아이템을 뽑는데 오류가 발생했습니다. 다시 시도해주세요."
          onClose={() => {
            setError(false);
          }}
        />
      )}

      <MyBottomNavBar />
    </div>
  );
}

export default Store;
