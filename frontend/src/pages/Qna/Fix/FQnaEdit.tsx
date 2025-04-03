import { useNavigate, useParams } from "react-router-dom";
import MyHeader from "../../../components/MyHeader/MyHeader";
import MyButton from "../../../components/MyButton/MyButton";
import Button from "./Button";
import FQnaEditor from "./FQnaEditor";
import { useEffect, useState } from "react";

import "./FQnaEdit.css";
import { mockDataService } from "./mock";

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
      const response = await mockDataService.getQnaById(questionId);
      const data = response.data.data;

      // 이메일 주소에서 이메일과 도메인 분리
      const emailParts = data.email.split("@");

      // 상태 변수 업데이트
      setSortType(data.category);
      setEmail(emailParts[0]);
      setEmailType(emailParts[1] || "naver.com");
      setContent(data.question);

      // initData 객체 업데이트
      setInitData({
        sortType: data.category,
        email: emailParts[0],
        emailType: emailParts[1] || "naver.com",
        content: data.question,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function onDelete(questionId) {
    try {
      await mockDataService.deleteQna(questionId);
    } catch (error) {
      console.error(error);
    }
  }

  async function onUpdate(questionId, sortType, email, emailType, content) {
    try {
      // 원래 코드와 같이 카테고리 변환 로직 유지
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

      await mockDataService.updateQna(questionId, {
        category: sortType,
        email: email + "@" + emailType,
        question: content,
      });
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
