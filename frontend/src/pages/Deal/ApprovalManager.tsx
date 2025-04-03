import React, { useState, useEffect, useCallback } from "react";
import ApprovalModal from "../../components/Modal/Approval/ApprovalModal";
import Loading from "../../components/Loading/Loading";
import Modal from "react-modal";
import { ContractAddress } from "../../constant/contract";

interface ApprovalManagerProps {
  onAllApproved: () => void;
  onCancel: () => void;
}

// Mock ApprovalStatus 인터페이스
export interface ApprovalStatus {
  [key: string]: {
    name: string;
    approved: boolean;
  };
}

// Mock RPC 클래스 대신 모의 함수들을 구현
const mockApprovalFunctions = {
  // 초기 승인 상태를 체크하는 함수
  checkApprovalStatus: (): Promise<ApprovalStatus> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 모의 승인 상태 데이터
        const status: ApprovalStatus = {
          [ContractAddress.BlueprintItem]: {
            name: "설계도면",
            approved: false,
          },
          [ContractAddress.PuzzlePiece]: {
            name: "퍼즐조각",
            approved: false,
          },
          [ContractAddress.MaterialItems[0]]: {
            name: "붉은벽돌",
            approved: true,
          },
          [ContractAddress.MaterialItems[1]]: {
            name: "모래",
            approved: false,
          },
          [ContractAddress.MaterialItems[2]]: {
            name: "망치",
            approved: true,
          },
          [ContractAddress.MaterialItems[3]]: {
            name: "유리",
            approved: false,
          },
          [ContractAddress.MaterialItems[4]]: {
            name: "산타양말",
            approved: false,
          },
        };
        resolve(status);
      }, 800);
    });
  },

  // 승인 처리 함수
  setApprovalForAll: (
    contractAddress: string,
    approved: boolean
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`승인 ${approved ? "설정" : "해제"}: ${contractAddress}`);
        resolve(true);
      }, 1000);
    });
  },

  // 승인 해제 함수 (내부적으로 setApprovalForAll을 호출)
  revokeApproval: (contractAddress: string): Promise<boolean> => {
    return mockApprovalFunctions.setApprovalForAll(contractAddress, false);
  },
};

const ApprovalManager: React.FC<ApprovalManagerProps> = ({
  onAllApproved,
  onCancel,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkApprovalStatus = useCallback(async () => {
    setLoading(true);
    try {
      const status = await mockApprovalFunctions.checkApprovalStatus();
      setApprovalStatus(status);

      const allApproved = Object.values(status).every((item) => item.approved);
      if (allApproved) {
        onAllApproved();
      } else {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error checking approval status:", error);
    } finally {
      setLoading(false);
    }
  }, [onAllApproved]);

  useEffect(() => {
    checkApprovalStatus();
  }, [checkApprovalStatus]);

  const handleApprove = async (contractAddress: string) => {
    if (!isLoading) {
      setIsLoading(true);
      try {
        const txPromise = mockApprovalFunctions.setApprovalForAll(
          contractAddress,
          true
        );

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
        } else {
          // 모든 항목이 승인되었는지 확인
          const updatedStatus = {
            ...approvalStatus,
            [contractAddress]: {
              ...approvalStatus[contractAddress],
              approved: true,
            },
          };

          const allApproved = Object.values(updatedStatus).every(
            (item) => item.approved
          );
          if (allApproved) {
            // 모든 항목이 승인되면 모달 닫고 콜백 호출
            setTimeout(() => {
              setIsModalOpen(false);
              onAllApproved();
            }, 500);
          }
        }
      } catch (error) {
        console.error("Approval error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRevoke = async (contractAddress: string) => {
    if (!isLoading) {
      setIsLoading(true);
      try {
        const success = await mockApprovalFunctions.revokeApproval(
          contractAddress
        );
        if (success) {
          setApprovalStatus((prevStatus) => ({
            ...prevStatus,
            [contractAddress]: {
              ...prevStatus[contractAddress],
              approved: false,
            },
          }));
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
