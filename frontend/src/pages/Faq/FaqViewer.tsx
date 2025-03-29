import React, { useState, useEffect } from "react";
import FaqItem from "./FaqItem";
import axios from "axios";
import "./FaqViewer.css";

const FaqViewer: React.FC = () => {
  const [faqs, setFaqs] = useState([]);
  const RequestURL = import.meta.env.VITE_REQUEST_URL;

  useEffect(() => {
    fetchFaq();
  }, []);

  const fetchFaq = async () => {
    try {
      const response = await axios.get(RequestURL + "/v1/support/faq");
      console.log(response);
      const data = await response.data;
      setFaqs(data.data.list);
    } catch (error) {
      console.error("Error fetching FAQ:", error);

      // API 호출에 실패할 경우에만 Mock 데이터 사용
      const mockData = [
        { question: "암호화폐 지갑이란?", answer: "암호화폐 지갑 답변" },
        {
          question: "보유자산은 실시간으로 업데이트 되나요?",
          answer:
            "마이페이지, 상점에 진입할 때마다 최신 정보가 업데이트 돼요. 화면을 새로고침하여 직접 업데이트도 가능해요.",
        },
        {
          question: "Duzzle에 연락하려면 어떻게 해야 하나요?",
          answer: "duzzle팀 이메일: dukdol@duksung.ac.kr",
        },
        {
          question: "“404” 오류는 무엇을 의미하나요?",
          answer:
            "404 오류는 사용자가 사이트에서 존재하지 않는 URL을 탐색했을 때 발생합니다.",
        },
        {
          question: "NFT 를 삭제하려면 어떻게 해야 합니까?",
          answer: "duzzle팀에게 문의 주세요",
        },
      ];
      setFaqs(mockData);
    }
  };
  async function getData() {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://duzzle-dev-env.eba-tesapmjt.ap-northeast-2.elasticbeanstalk.com/v1/support/faq",
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="faq-viewer">
      {faqs.map((faq, index) => (
        <FaqItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

export default FaqViewer;
