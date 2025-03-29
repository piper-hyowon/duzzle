import React from "react";

interface ApprovalItemProps {
  contractAddress: string;
  name: string;
  approved: boolean;
  onApprove: (contractAddress: string) => void;
  onRevoke: (contractAddress: string) => void;
  isLoading: boolean;
}

const ApprovalItem: React.FC<ApprovalItemProps> = React.memo(
  ({ contractAddress, name, approved, onApprove, onRevoke, isLoading }) => {
    return (
      <div className="approval-item">
        <div>
          <span className="token-name">{name}</span>
          <span
            className={`approval-status ${
              approved ? "approved" : "not-approved"
            }`}
          >
            {approved ? " (승인됨)" : " (미승인)"}
          </span>
        </div>
        <button
          className={`button ${approved ? "button-revoke" : "button-approve"}`}
          onClick={() =>
            approved ? onRevoke(contractAddress) : onApprove(contractAddress)
          }
          disabled={isLoading}
        >
          {isLoading ? "처리 중..." : approved ? "승인 취소" : "승인하기"}
        </button>
      </div>
    );
  }
);

export default ApprovalItem;
