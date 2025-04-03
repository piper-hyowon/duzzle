import "./Profile.css";
import { useEffect, useRef, useState } from "react";
import MyButton from "../../components/MyButton/MyButton";
import MyHeader from "../../components/MyHeader/MyHeader";
import ConfirmCancelModal from "../../components/Modal/ConfirmCancelModal";
import AlertModal from "../../components/Modal/AlertModal";
import { MOCK_USER_DATA } from "../../services/mockData";

function Profile() {
  const [image, setImage] = useState(MOCK_USER_DATA.image);
  const [wallet, setWallet] = useState(MOCK_USER_DATA.walletAddress);
  const [name, setName] = useState(MOCK_USER_DATA.name);
  const [email, setEmail] = useState(MOCK_USER_DATA.email);
  const [profileType, setProfileType] = useState(MOCK_USER_DATA.profileType);
  const [history, setHistory] = useState(MOCK_USER_DATA.history);

  const [isEditingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isEditingImg, setEditingImg] = useState(false);
  const ImgInput = useRef<HTMLInputElement | null>(null);
  const [isEditingType, setEditingType] = useState(false);

  const toastRef = useRef<HTMLDivElement>(null);

  const [showCCModal, setShowCCModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  // Simulate fetching user data (normally done via API)
  useEffect(() => {
    // In a mock scenario, we're using the predefined MOCK_USER_DATA
    // This simulates the original useEffect that fetched data
  }, [isEditingName, isEditingImg, isEditingType]);

  // Mock name change function
  const onNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedName(e.target.value);
  };

  const onEditName = async () => {
    openConfirmCancelModal(
      "변경",
      "이름(닉네임)을 바꾸시겠습니까?",
      async () => {
        try {
          if (editedName.trim()) {
            setName(editedName);
            setEditingName(false);
            setEditedName("");
          }
        } catch (error) {
          console.error(error);
        }
        setShowCCModal(false);
      }
    );
  };

  async function onUploadImg(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setEditingImg(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
    }
  }

  const handleClick = () => {
    if (!ImgInput.current) {
      return;
    }
    ImgInput.current.click();
    setEditingImg(true);
  };

  // Mock profile type change function
  async function patchProfileType(type: string) {
    openConfirmCancelModal(
      "변경",
      "프로필 공개여부를 바꾸시겠습니까?",
      async () => {
        try {
          // Simulate profile type patch request
          setProfileType(type);
          setEditingType(false);
        } catch (error) {
          console.error(error);
        }
        setShowCCModal(false);
      }
    );
  }

  // Wallet address copy function
  const onCopyClick = () => {
    navigator.clipboard
      .writeText(wallet)
      .then(() => {
        showToast("복사되었습니다!");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  // Toast notification function
  const showToast = (message: string) => {
    if (toastRef.current) {
      toastRef.current.textContent = message;
      toastRef.current.className = "toast show";
      setTimeout(() => {
        if (toastRef.current) {
          toastRef.current.className = toastRef.current.className.replace(
            "show",
            ""
          );
        }
      }, 1000);
    }
  };

  // Modal open functions remain the same as in the original
  const openConfirmCancelModal = (
    title: string,
    content: string,
    onConfirm: () => void
  ) => {
    setModalTitle(title);
    setModalContent(content);
    setConfirmAction(() => onConfirm);
    setShowCCModal(true);
  };
  const handleCCModalClose = () => {
    setShowCCModal(false);
  };

  const openAlertModal = (content: string) => {
    setModalContent(content);
    setShowAlertModal(true);
  };
  const handleAlertModalClose = () => {
    setShowAlertModal(false);
  };

  return (
    <div className="Profile">
      <MyHeader headerText="프로필" leftChild={<MyButton />} />
      <div className="profile_title">
        <p>나의 정보</p>
      </div>
      <div className="profile_img">
        <img src={image} alt="Profile" />
        <button onClick={handleClick}>
          <svg
            data-slot="icon"
            fill="none"
            strokeWidth="1.7"
            stroke="#ffffff"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            ></path>
          </svg>
          <input
            type="file"
            accept="image/*"
            name="userImg"
            ref={ImgInput}
            onChange={onUploadImg}
            style={{ display: "none" }}
          />
        </button>
      </div>
      <div className="profile_list_title">
        <p>개인정보</p>
      </div>
      <div className="profile_list">
        <section className="profile_wallet">
          <p className="list_name">지갑 주소</p>
          <div className="wallet">
            <p>{wallet}</p>
            <button onClick={onCopyClick}>
              <svg
                data-slot="icon"
                fill="none"
                strokeWidth="2.0"
                stroke="rgba(0, 0, 0, 0.3)"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
                ></path>
              </svg>
              <div ref={toastRef} className="toast"></div>
            </button>
          </div>
        </section>
        <section className="profile_name">
          <p className="list_name">
            이름(닉네임)
            <div className="tooltip">
              <svg
                className="tooltip_icon"
                data-slot="icon"
                fill="none"
                strokeWidth="2.5"
                stroke="#8c8c8c"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                ></path>
              </svg>
              <span className="tooltip_text">
                24시간에 한 번 변경 가능합니다.
                <br />
                30자 이내로 입력 가능합니다.
              </span>
            </div>
          </p>
          <div className="name">
            {isEditingName ? (
              <textarea onChange={onNameChange} placeholder={name} />
            ) : (
              <p>{name || "Unknown"}</p>
            )}
            {isEditingName ? (
              <>
                {editedName.length > 0 ? (
                  <button className="done" onClick={onEditName}>
                    <svg
                      data-slot="icon"
                      fill="none"
                      strokeWidth="2.0"
                      stroke="rgba(0, 0, 0, 0.3)"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      ></path>
                    </svg>
                  </button>
                ) : (
                  <button onClick={() => setEditingName(false)}>
                    <svg
                      data-slot="icon"
                      fill="none"
                      strokeWidth="2.0"
                      stroke="rgba(0, 0, 0, 0.3)"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                )}
              </>
            ) : (
              <button className="edit" onClick={() => setEditingName(true)}>
                <svg
                  data-slot="icon"
                  fill="none"
                  strokeWidth="2.0"
                  stroke="rgba(0, 0, 0, 0.3)"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  ></path>
                </svg>
              </button>
            )}
          </div>
        </section>
        {email && (
          <section className="profile_email">
            <p className="list_name">이메일</p>
            <div className="email">
              <p>{email}</p>
            </div>
          </section>
        )}
        <section className="profile_achievement">
          <p className="list_name">업적</p>
          <div className="achievement">
            <p className="record">시즌 랭킹 1위: {history.rankedFirst}</p>
            <p className="record">시즌 랭킹 상위 3위: {history.rankedThird}</p>
            <p className="record">
              시즌 랭킹 퀘스트 연승: {history.questStreak}
            </p>
          </div>
        </section>
        <section className="profile_type">
          <p className="list_name">
            프로필<br></br>공개여부
          </p>
          <div className="tooltip">
            <svg
              className="tooltip_icon"
              data-slot="icon"
              fill="none"
              strokeWidth="2.5"
              stroke="#8c8c8c"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
              ></path>
            </svg>
            <span className="tooltip_text">
              공개 데이터:<br></br>이름, 지갑 주소, 보유 NFT 정보
            </span>
          </div>
          <div className="type">
            {isEditingType ? (
              <>
                <button
                  className="typeBtn"
                  onClick={() => patchProfileType("PUBLIC")}
                >
                  public<br></br>모두에게 공개
                </button>
                <button
                  className="typeBtn"
                  onClick={() => patchProfileType("PRIVATE")}
                >
                  private<br></br>유저에게 공개
                </button>
                <button
                  className="typeBtn"
                  onClick={() => patchProfileType("NONE")}
                >
                  none<br></br>비공개
                </button>
                <button className="edit" onClick={() => setEditingType(false)}>
                  <svg
                    data-slot="icon"
                    fill="none"
                    strokeWidth="2.0"
                    stroke="rgba(0, 0, 0, 0.3)"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </>
            ) : (
              <>
                <p>{profileType}</p>
                <button className="edit" onClick={() => setEditingType(true)}>
                  <svg
                    data-slot="icon"
                    fill="none"
                    strokeWidth="2.0"
                    stroke="rgba(0, 0, 0, 0.3)"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    ></path>
                  </svg>
                </button>
              </>
            )}
          </div>
        </section>
      </div>
      {showCCModal && (
        <ConfirmCancelModal
          isOpen={showCCModal}
          title={modalTitle}
          content={modalContent}
          onConfirm={confirmAction}
          onCancel={handleCCModalClose}
        />
      )}
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

export default Profile;
