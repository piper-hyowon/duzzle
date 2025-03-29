import { useNavigate, useParams } from "react-router-dom";
import MyHeader from "../../../components/MyHeader/MyHeader";
import MyButton from "../../../components/MyButton/MyButton";
import Button from "./Button";
import FQnaEditor from "./FQnaEditor";
import { useEffect, useState } from "react";
import axios from "axios";

import "./FQnaEdit.css";

const RequestURL = import.meta.env.VITE_REQUEST_URL;

const FQnaEdit = () => {
  const params = useParams();
  const questionId = params.id;
  const [sortType, setSortType] = useState("");
  const [email, setEmail] = useState("");
  const [emailType, setEmailType] = useState("naver.com");
  const [content, setContent] = useState("");
  const [initData, setInitData] = useState({
    sortType,
    email,
    emailType,
    content,
  });
  const nav = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        RequestURL + `/v1/support/qna/${questionId}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      //.log("GET 성공", response);

      const data = response.data.data;
      setInitData({
        sortType: data.category,
        email: data.email.split("@")[0],
        emailType: data.email.split("@")[1],
        content: data.question,
      });
    } catch (error) {
      console.error(error);
    }
  }
  async function onDelete(questionId) {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(
        RequestURL + `/v1/support/qna/${questionId}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      //console.log("DELETE 성공", response);
    } catch (error) {
      console.error(error);
    }
  }

  async function onUpdate(questionId, sortType, email, emailType, content) {
    try {
      let category = "";
      if (sortType === "거래") {
        category = "MARKET";
      } else if (sortType === "계정") {
        category = "ACCOUNT";
      } else if (sortType === "퀘스트") {
        category = "QUEST";
      } else if (sortType === "스토리") {
        category = "STORY";
      } else if (sortType === "기타") {
        category = "ETC";
      }
      const token = localStorage.getItem("accessToken");
      //console.log("questionId:", questionId);
      //console.log("email:", email);
      //console.log("content:", content);
      const response = await axios.put(
        RequestURL + `/v1/support/qna/${questionId}`,
        {
          category: sortType,
          email: email + "@" + emailType,
          question: content,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      //console.log("PUT 성공", response.data);
    } catch (error) {
      console.error("요청 실패:", error);
    }
  }

  const onClickDelete = () => {
    if (window.confirm("문의를 정말 삭제하시겠습니까?")) {
      onDelete(questionId);
      nav("/qna");
    }
  };

  const onSubmit = (input) => {
    if (window.confirm("문의를 수정하시겠습니까?")) {
      onUpdate(
        questionId,
        input.sortType,
        input.email,
        input.emailType,
        input.content
      );
      nav("/qna");
      //console.log(initData.content);
    }
  };

  return (
    <>
      <div className="QnaEdit">
        <MyHeader headerText="문의 수정하기" leftChild={<MyButton />} />
        <FQnaEditor initData={initData} onSubmit={onSubmit} />
      </div>
      <section className="button_section">
        <Button text={"삭제하기"} onClick={onClickDelete} />
      </section>
    </>
  );
};

export default FQnaEdit;
