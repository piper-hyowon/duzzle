import { useEffect, useState } from "react";
import MyHeader from "../../../components/MyHeader/MyHeader";
import MyButton from "../../../components/MyButton/MyButton";
import FQnaViewer from "./FQnaViewer";
import { useParams } from "react-router-dom";
import "../Fix/FQnaDetail.css";
import { mockDataService } from "./mock";

const FQnaDetail = () => {
  const { id } = useParams();
  const [sortType, setSortType] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const response = await mockDataService.getQnaById(id);
      const data = response.data.data;
      setSortType(data.category);
      setEmail(data.email);
      setContent(data.question);
      setAnswer(data.answer);
      setIsAnswered(data.isAnswered);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="QnaDiary">
      <MyHeader headerText="내 문의" leftChild={<MyButton />} />
      <FQnaViewer
        sortType={sortType}
        email={email}
        content={content}
        answer={answer}
        isAnswered={isAnswered}
      />
    </div>
  );
};

export default FQnaDetail;
