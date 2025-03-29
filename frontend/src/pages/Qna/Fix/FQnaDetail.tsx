import { useEffect, useState } from "react";
import MyHeader from "../../../components/MyHeader/MyHeader";
import MyButton from "../../../components/MyButton/MyButton";
import FQnaViewer from "./FQnaViewer";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../Fix/FQnaDetail.css";

const RequestURL = import.meta.env.VITE_REQUEST_URL;

const FQnaDetail = () => {
  const { id } = useParams();
  const [sortType, setSortType] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(RequestURL + `/v1/support/qna/${id}`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      //console.log("GET 성공", response);
      setSortType(response.data["data"]["category"]);
      setEmail(response.data["data"]["email"]);
      setContent(response.data["data"]["question"]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="QnaDiary">
      <MyHeader headerText="내 문의" leftChild={<MyButton />} />
      <FQnaViewer sortType={sortType} email={email} content={content} />
    </div>
  );
};

export default FQnaDetail;
