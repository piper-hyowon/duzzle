import { useNavigate } from "react-router-dom";
import "./MyButton.css";

const MyButton = () => {
  const navigate = useNavigate();

  return (
    <button className="MyButton" onClick={() => navigate(-1)}>
      <svg
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          clipRule="evenodd"
          fillRule="evenodd"
          d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
        ></path>
      </svg>
    </button>
  );
};

export default MyButton;
