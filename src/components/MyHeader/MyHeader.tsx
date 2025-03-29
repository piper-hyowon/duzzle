import React from "react";
import "./MyHeader.css";

interface MyHeaderProps {
  headerText: string;
  leftChild: React.ReactNode;
}

const MyHeader: React.FC<MyHeaderProps> = ({ headerText, leftChild }) => {
  return (
    <header>
      <div className="head_btn_left">{leftChild}</div>
      <div className="head_text">{headerText}</div>
    </header>
  );
};

export default MyHeader;
