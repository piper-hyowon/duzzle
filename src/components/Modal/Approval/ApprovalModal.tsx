import React, { useEffect } from "react";
import "../Modal.css";
import { ApprovalStatus } from "../../../../ethersRPC";
import ApprovalItem from "./ApprovalItem";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  approvalStatus: ApprovalStatus;
  onApprove: (contractAddress: string) => Promise<void>;
  onRevoke: (contractAddress: string) => Promise<void>;
  isLoading: boolean;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  approvalStatus,
  onApprove,
  onRevoke,
  isLoading,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const allApproved = Object.values(approvalStatus).every(
    (item) => item.approved
  );

  return (
    <div className="approval-modal">
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">토큰 승인 상태</h2>
          {Object.entries(approvalStatus).map(
            ([address, { name, approved }]) => (
              <ApprovalItem
                key={address}
                contractAddress={address}
                name={name}
                approved={approved}
                onApprove={onApprove}
                onRevoke={onRevoke}
                isLoading={isLoading}
              />
            )
          )}
          {allApproved ? (
            <button
              className="button submit-button"
              onClick={onClose}
              disabled={isLoading}
            >
              거래 등록하기
            </button>
          ) : (
            <p>
              모든 토큰을 승인해야 거래를 등록할 수 있습니다.(최초 1회만 필요)
            </p>
          )}
          <button className="button cancel-button" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
