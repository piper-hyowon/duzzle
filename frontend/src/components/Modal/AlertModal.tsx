import "./Modal.css";

interface AlertModalProps {
  isOpen: boolean;
  content: string;
  onConfirm: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  content,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="alert-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">알림</h2>
          <p>{content}</p>
          <button className="button submit-button" onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
