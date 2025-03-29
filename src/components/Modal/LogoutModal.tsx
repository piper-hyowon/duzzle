import "./Modal.css";

interface LogoutModalProps {
  isOpen: boolean;
  content: string;
  onClose: () => void;
  onLogout: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  content,
  onClose,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="logout-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">로그아웃</h2>
          <p>{content}</p>
          <button className="button submit-button" onClick={onLogout}>
            로그아웃
          </button>
          <button className="button cancel-button" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
