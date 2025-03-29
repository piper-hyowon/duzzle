import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="NotFound">
      <img src="/src/assets/images/duzzle logo.png" />
      <p>요청하신 페이지를 찾을 수 없습니다.</p>
      <Link to="/">
        <button>홈으로 가기</button>
      </Link>
    </div>
  );
}

export default NotFound;
