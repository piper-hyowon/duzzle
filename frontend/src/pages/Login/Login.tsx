import "./Login.css";
import { useAuth } from "../../services/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { web3auth, duzzleLoggedIn } = useAuth();
  const navigate = useNavigate();

  const login = async (): Promise<void> => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
    } else {
      await web3auth.connect();
      window.location.replace("/login");
    }
  };

  const LoggedInView = (
    <button onClick={() => navigate("/")} className="login-buttons">
      홈으로 이동
    </button>
  );

  const UnloggedInView = (
    <button onClick={login} className="login-buttons">
      로그인
    </button>
  );

  return (
    <div className="Login">
      <img className="duzzle-logo" src="/src/assets/images/duzzle logo.png" />
      <div className="grid">
        {duzzleLoggedIn ? LoggedInView : UnloggedInView}
      </div>
    </div>
  );
}

export default Login;
