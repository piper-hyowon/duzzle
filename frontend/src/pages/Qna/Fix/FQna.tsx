import { useEffect, useState } from "react";
import FQnaList from "./FQnaList";
import MyHeader from "../../../components/MyHeader/MyHeader";
import MyButton from "../../../components/MyButton/MyButton";
import "./FQna.css";
import { mockDataService } from "./mock";

const FQna = () => {
  const [qnas, setQnas] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const response = await mockDataService.getQnaList();
      setQnas(response.data.list);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="Qna">
      <MyHeader headerText="1:1 문의하기" leftChild={<MyButton />} />
      <div className="Qna_wrapper">
        <FQnaList data={qnas} />
      </div>
    </div>
  );
};

export default FQna;
