import MyHeader from "../../../components/MyHeader/MyHeader";
import MyButton from "../../../components/MyButton/MyButton";
import { useNavigate } from "react-router-dom";
import "../Fix/FQnaNew.css";
import FQnaEditor from "./FQnaEditor";
import { mockDataService } from "./mock";

const FQnaNew = () => {
  const nav = useNavigate();

  async function onSubmit(updatedInput) {
    try {
      await mockDataService.createQna({
        category: updatedInput.sortType,
        email: updatedInput.email + "@" + updatedInput.emailType,
        question: updatedInput.content,
      });
      nav("/qna");
    } catch (error) {
      console.error("요청 실패:", error);
    }
  }

  return (
    <div className="QnaNew">
      <MyHeader headerText="새 문의쓰기" leftChild={<MyButton />} />
      <FQnaEditor />
    </div>
  );
};

export default FQnaNew;
