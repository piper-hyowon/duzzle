import React, { useEffect, useState } from "react";
import "../Fix/FQnaEditor.css";
import { showDemoFeatureToast } from "../../../components/Toast";

interface FQnaEditorProps {
  initData?: {
    sortType: string;
    email: string;
    emailType: string;
    content: string;
  };
  onSubmit?: (input: {
    sortType: string;
    email: string;
    emailType: string;
    content: string;
  }) => void;
}

const FQnaEditor: React.FC<FQnaEditorProps> = ({ initData, onSubmit }) => {
  const [state, setState] = useState({
    sortType: "",
    email: "",
    emailType: "naver.com",
    content: "",
  });

  const sortOptions = ["거래", "계정", "퀘스트", "스토리", "기타"];
  const emailOptions = ["naver.com", "gmail.com", "kakao.com", "직접입력"];

  useEffect(() => {
    if (initData) {
      setState({
        sortType: initData.sortType || "",
        email: initData.email || "",
        emailType: initData.emailType || "naver.com",
        content: initData.content || "",
      });
    }
  }, [initData]);

  const handleSubmit = () => {
    if (state.sortType.length < 1) {
      alert("분류를 선택해주세요");
      return;
    }

    if (state.email.length < 1) {
      alert("이메일을 적어주세요");
      return;
    }

    if (state.content.length < 1) {
      alert("문의 내용을 적어주세요");
      return;
    }

    showDemoFeatureToast("저장 기능은");
  };

  return (
    <div className="QnaEditor">
      <section>
        <h4>분류</h4>
        <select
          className="sort_select"
          value={state.sortType}
          onChange={(e) => setState({ ...state, sortType: e.target.value })}
        >
          <option value="">선택하세요</option>
          {sortOptions.map((it, idx) => (
            <option key={idx} value={it}>
              {it}
            </option>
          ))}
        </select>
      </section>
      <section>
        <h4>이메일</h4>
        <div className="email_wrapper">
          <input
            className="email_input"
            value={state.email}
            onChange={(e) => setState({ ...state, email: e.target.value })}
          />
          <span>@</span>
          <select
            className="email_select"
            value={state.emailType}
            onChange={(e) => setState({ ...state, emailType: e.target.value })}
          >
            {emailOptions.map((it, idx) => (
              <option key={idx} value={it}>
                {it}
              </option>
            ))}
          </select>
        </div>
      </section>
      <section>
        <h4>내용</h4>
        <textarea
          className="text_area"
          placeholder="문의 내용을 작성해주세요"
          value={state.content}
          onChange={(e) => setState({ ...state, content: e.target.value })}
        />
      </section>
      <section>
        <div className="control_box">
          <button onClick={handleSubmit}>저장하기</button>
        </div>
      </section>
    </div>
  );
};

export default FQnaEditor;
