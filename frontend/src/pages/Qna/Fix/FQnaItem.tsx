import { useNavigate } from "react-router-dom";
import Button from "./Button";

import "./FQnaItem.css";

const FQnaItem = ({ id, submitTime, content, answer_section }) => {
  const nav = useNavigate();

  return (
    <div className="QnaItem">
      <div onClick={() => nav(`/qnadetail/${id}`)} className="infor_section">
        <div className="content">{content}</div>
        <div className="created_date">
          등록일 {new Date(submitTime).toLocaleDateString()}
        </div>
      </div>
      <div>
        <div className="answer_section">
          {answer_section ? "답변완료" : "답변대기"}
        </div>
        <div className="button_section">
          <Button onClick={() => nav(`/qnaedit/${id}`)} text={"수정하기"} />
        </div>
      </div>
    </div>
  );
};

export default FQnaItem;
