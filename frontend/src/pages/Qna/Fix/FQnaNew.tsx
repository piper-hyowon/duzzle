import MyHeader from "../../../components/MyHeader/MyHeader";
import MyButton from "../../../components/MyButton/MyButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Fix/FQnaNew.css";
import FQnaEditor from "./FQnaEditor";

const RequestURL = import.meta.env.VITE_REQUEST_URL;

const FQnaNew = () => {
  const nav = useNavigate();

  const onSort = (value) => {
    if (value === "거래") return "MARKET";
    else if (value === "계정") return "ACCOUNT";
    else if (value === "퀘스트") return "QUEST";
    else if (value === "스토리") return "STORY";
    else if (value === "기타") return "ETC";
  };

  async function onSubmit(updatedInput) {
    try {
      const category = onSort(updatedInput.sortType);
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        RequestURL + "/v1/support/qna",
        {
          category: category,
          email: updatedInput.email + "@" + updatedInput.emailType,
          question: updatedInput.content,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      //console.log("POST 성공", response.data);
      nav("/qna");
    } catch (error) {
      console.error("요청 실패:", error);
    }
  }

  return (
    <div className="QnaNew">
      <MyHeader headerText="새 문의쓰기" leftChild={<MyButton />} />
      <FQnaEditor initData={undefined} onSubmit={onSubmit} />
    </div>
  );
};

export default FQnaNew;
