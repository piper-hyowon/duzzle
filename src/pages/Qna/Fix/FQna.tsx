import axios from "axios";
import { useEffect, useState } from "react";
import FQnaList from "./FQnaList";
import MyHeader from "../../../components/MyHeader/MyHeader";
import MyButton from "../../../components/MyButton/MyButton";
import "./FQna.css";

const RequestURL = import.meta.env.VITE_REQUEST_URL;

const FQna = () => {
  const [qnas, setQnas] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(RequestURL + "/v1/support/qna", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      //console.log("GET 성공", response);
      setQnas(response.data["data"]["list"]);
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
