import { useEffect, useState } from "react";
import Button from "./Button";

import "./FQnaEditor.css";

const FQnaEditor = ({ initData, onSubmit }) => {
  const [sortType, setSortType] = useState("거래");
  const [email, setEmail] = useState("");
  const [emailType, setEmailType] = useState("naver.com");
  const [content, setContent] = useState("");

  const onChangeSortType = (e) => {
    const value = e.target.value;
    setSortType(value);
    setInput({
      ...input,
      sortType: value,
    });
  };

  const onChangeEmailType = (e) => {
    const value = e.target.value;
    setEmailType(value);
    setInput({
      ...input,
      emailType: value,
    });
  };

  const [input, setInput] = useState({
    sortType,
    email: "",
    emailType,
    content: "",
  });

  useEffect(() => {
    if (initData) {
      setInput({ ...initData });
    }
  }, [initData]);

  const onChangeInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setInput({
      ...input,
      [name]: value,
    });
  };

  const onClickSubmitButton = () => {
    const currentTime = new Date().toLocaleString();
    const updatedInput = {
      ...input,
      submitTime: currentTime,
    };
    onSubmit(updatedInput);
  };
  //console.log(input.content);

  return (
    <div className="Editor">
      <section className="sort_section">
        <div className="sort_title">🧩 문의 종류</div>
        <div className="menu_bar">
          <select
            value={input.sortType}
            onChange={onChangeSortType}
            className="pl"
          >
            <option value="MARKET">거래</option>
            <option value="ACCOUNT">계정</option>
            <option value="QUEST">퀘스트</option>
            <option value="STORY">스토리</option>
            <option value="ETC">기타</option>
          </select>
        </div>
      </section>
      <section className="email_section">
        <div className="email_title">💌 이메일 </div>
        <input
          onChange={onChangeInput}
          value={input.email}
          name="email"
          className="emailinput"
        ></input>
        <div>@</div>
        <div className="email_bar">
          <select
            value={input.emailType}
            onChange={onChangeEmailType}
            className="pl2"
          >
            <option value={"naver.com"}>naver.com</option>
            <option value={"gmail.com"}>gmail.com</option>
            <option value={"duksung.ac.kr"}>duksung.ac.kr</option>
            <option value={"daum.net"}>daum.net</option>
            <option value={"hanmail.net"}>hanmail.net</option>
          </select>
        </div>
      </section>
      <section className="content_section">
        <div className="content_title">🌙 문의 사항</div>
        <textarea
          name="content"
          value={input.content}
          onChange={onChangeInput}
          placeholder="문의 내용을 작성해주세요."
        ></textarea>
      </section>
      <section className="button_section">
        <Button text={"문의 접수"} onClick={onClickSubmitButton} />
      </section>
    </div>
  );
};

export default FQnaEditor;
