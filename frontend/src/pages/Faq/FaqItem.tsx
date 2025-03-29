import "./FaqItem.css";
import React, { useState } from "react";

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAnswer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="faq-item">
      <div className="question" tabIndex={0} onClick={toggleAnswer}>
        {question}
        <button>{isOpen ? "ㅤㅤ" : "ㅤㅤ"}</button>
      </div>
      {isOpen && <div className="answer">{answer}</div>}
    </div>
  );
};

export default FaqItem;
