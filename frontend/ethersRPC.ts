/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContractAddress } from "./src/constant/contract";

export interface ApprovalStatus {
  [key: string]: {
    name: string;
    approved: boolean;
  };
}

export interface NFTMetadata {
  name: string;
  image: string;
  description?: string;
  attributes?: any[];
}

export default class EthereumRpc {
  async checkApprovalStatus(): Promise<ApprovalStatus> {
    const nftAddresses = {
      설계도면: ContractAddress.BlueprintItem,
      퍼즐조각: ContractAddress.PuzzlePiece,
      붉은벽돌: ContractAddress.MaterialItems[0],
      모래: ContractAddress.MaterialItems[1],
      망치: ContractAddress.MaterialItems[2],
      유리: ContractAddress.MaterialItems[3],
      산타양말: ContractAddress.MaterialItems[4],
    };

    const status: ApprovalStatus = {};

    for (const [name, contractAddress] of Object.entries(nftAddresses)) {
      status[contractAddress] = {
        name,
        approved: await this.isApprovedForAll(contractAddress, ""),
      };
    }

    return status;
  }

  async setApprovalForAll(
    nftAddress: string,
    approved: boolean
  ): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }

  async revokeApproval(nftAddress: string): Promise<boolean> {
    return this.setApprovalForAll(nftAddress, false);
  }

  async isApprovedForAll(contractAddress, userAddress): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }

  async getRandomItem(
    onStateChange?: (state: string) => void
  ): Promise<NFTMetadata> {
    try {
      onStateChange?.("트랜잭션 시작...");
      await this.delay(800);

      onStateChange?.("트랜잭션을 전송하는 중...");
      await this.delay(1000);

      onStateChange?.(`트랜잭션이 처리되고 있습니다...\n(예상 시간: 10-15초)`);
      await this.delay(3000);

      onStateChange?.("아이템 정보를 가져오는 중...");
      await this.delay(1000);

      const randomItems: NFTMetadata[] = [
        {
          name: "설계도면#79",
          image: "/src/assets/images/blueprint.png",
          attributes: [
            {
              value: "대강의동",
              trait_type: "위치",
            },
          ],
        },
        {
          name: "붉은벽돌 #3",
          image: "/src/assets/images/brick.png",
        },
        {
          name: "모래 #4",
          image: "/src/assets/images/sand.png",
        },
        {
          name: "망치 #5",
          image: "/src/assets/images/hammer.png",
        },
        {
          name: "유리 #6",
          image: "/src/assets/images/glass.png",
        },
        {
          name: "산타양말 #7",
          image: "/src/assets/images/sock.png",
        },
      ];

      const randomIndex = Math.floor(Math.random() * randomItems.length);
      return randomItems[randomIndex];
    } catch (error) {
      console.error("Random Item Error:", error);
      throw error;
    }
  }

  async unlockPuzzlePiece(pieceId: number): Promise<void> {
    await this.delay(2000); // 처리 시간 시뮬레이션

    const isSuccess = Math.random() < 0.7;

    if (!isSuccess) {
      throw new Error("재료가 부족합니다");
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
