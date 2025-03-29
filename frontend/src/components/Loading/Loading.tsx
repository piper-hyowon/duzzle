import Spinner from "../../assets/images/spinner.gif";

import "./Loading.css";

interface LoadingProps {
  message?: string;
}

const Loading = ({ message = "잠시만 기다려주세요" }: LoadingProps) => {
  return (
    <div className="Loading">
      <h3>{message}</h3>
      <img src={Spinner} alt="로딩" width="10%" />
    </div>
  );
};

export default Loading;
