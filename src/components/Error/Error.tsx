import ErrorImg from "../../assets/images/gear.gif";

import "./Error.css";

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

const Error: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="error-message">
      <p>{message}</p>
      <img src={ErrorImg} alt="에러" width="10%" />
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default Error;
