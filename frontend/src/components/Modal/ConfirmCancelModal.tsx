import "./Modal.css";

interface ConfirmCancelModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmCancelModal: React.FC<ConfirmCancelModalProps> = ({
  isOpen,
  title,
  content,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-cancel-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">{title}</h2>
          <p>{content}</p>
          <button className="button submit-button" onClick={onConfirm}>
            확인
          </button>
          <button className="button cancel-button" onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCancelModal;
