import React, { useState, useEffect, useCallback } from "react";
import { ApprovalStatus } from "../../../ethersRPC";
import RPC from "../../../ethersRPC";
import { IProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import ApprovalModal from "../../components/Modal/Approval/ApprovalModal";
import Loading from "../../components/Loading/Loading";
import Modal from "react-modal";

interface ApprovalManagerProps {
  web3auth: Web3Auth | null;
  onAllApproved: () => void;
  onCancel: () => void;
}

const ApprovalManager: React.FC<ApprovalManagerProps> = ({
  web3auth,
  onAllApproved,
  onCancel,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkApprovalStatus = useCallback(async () => {
    setLoading(true);
    if (web3auth?.provider) {
      const rpc = new RPC(web3auth.provider as IProvider);
      const status = await rpc.checkApprovalStatus();
      setApprovalStatus(status);

      const allApproved = Object.values(status).every((item) => item.approved);
      if (allApproved) {
        onAllApproved();
      } else {
        setIsModalOpen(true);
      }
    }
    setLoading(false);
  }, [web3auth, onAllApproved]);

  useEffect(() => {
    checkApprovalStatus();
  }, [checkApprovalStatus]);

  const handleApprove = async (contractAddress: string) => {
    if (web3auth?.provider && !isLoading) {
      setIsLoading(true);
      try {
        const rpc = new RPC(web3auth.provider as IProvider);
        const txPromise = rpc.setApprovalForAll(contractAddress, true);

        // 즉시 UI 업데이트
        setApprovalStatus((prevStatus) => ({
          ...prevStatus,
          [contractAddress]: { ...prevStatus[contractAddress], approved: true },
        }));

        // 백그라운드에서 트랜잭션 완료 대기
        const success = await txPromise;
        if (!success) {
          // 트랜잭션 실패 시 상태 롤백
          setApprovalStatus((prevStatus) => ({
            ...prevStatus,
            [contractAddress]: {
              ...prevStatus[contractAddress],
              approved: false,
            },
          }));
          console.error("Approval failed");
        }
      } catch (error) {
        console.error("Approval error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRevoke = async (contractAddress: string) => {
    if (web3auth?.provider && !isLoading) {
      setIsLoading(true);
      try {
        const rpc = new RPC(web3auth.provider as IProvider);
        const success = await rpc.revokeApproval(contractAddress);
        if (success) {
          setApprovalStatus((prevStatus) => ({
            ...prevStatus,
            [contractAddress]: {
              ...prevStatus[contractAddress],
              approved: true,
            },
          }));
          await checkApprovalStatus();
        } else {
          console.error("Revocation failed");
        }
      } catch (error) {
        console.error("Revocation error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    onCancel();
  };

  const customLoadingModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      width: "300px",
      height: "250px",
      borderRadius: "20px",
      justifyContent: "center",
      backgroundColor: "#F69EBB",
      boxShadow: "3px 3px 3px 3px rgba(0,0,0,0.25)",
    },
  };

  return (
    <>
      <ApprovalModal
        isOpen={isModalOpen}
        onClose={handleClose}
        approvalStatus={approvalStatus}
        onApprove={handleApprove}
        onRevoke={handleRevoke}
        isLoading={isLoading}
      />
      <Modal
        isOpen={loading}
        style={customLoadingModalStyles}
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
      >
        <Loading />
      </Modal>
    </>
  );
};

export default ApprovalManager;
