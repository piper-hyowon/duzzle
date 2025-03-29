/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";
import { ContractAddress, EventTopic } from "./src/constant/contract";
import { PlayDuzzleAbi } from "./src/constant/abi/playduzzle-abi";
import { BlueprintItemAbi } from "./src/constant/abi/blueprintItem-abi";
import { MaterialItemAbi } from "./src/constant/abi/MaterialItem-abi";
import { PuzzlePieceAbi } from "./src/constant/abi/puzzle-piece-abi";

export interface ApprovalStatus {
  [key: string]: {
    name: string;
    approved: boolean;
  };
}

export default class EthereumRpc {
  private provider: IProvider;
  private ethersProvider: ethers.BrowserProvider;

  constructor(provider: IProvider) {
    this.provider = provider;
    this.ethersProvider = new ethers.BrowserProvider(this.provider);
  }

  async getUserAddress(): Promise<string> {
    const signer = await this.ethersProvider.getSigner();
    return await signer.getAddress();
  }

  async checkApprovalStatus(): Promise<ApprovalStatus> {
    const userAddress = await this.getUserAddress();
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
        approved: await this.isApprovedForAll(contractAddress, userAddress),
      };
    }

    return status;
  }
  async setApprovalForAll(
    nftAddress: string,
    approved: boolean
  ): Promise<boolean> {
    try {
      const nftContract = new ethers.Contract(
        nftAddress,
        [
          "function setApprovalForAll(address operator, bool approved) external",
        ],
        await this.ethersProvider.getSigner()
      );

      const data = nftContract.interface.encodeFunctionData(
        "setApprovalForAll",
        [ContractAddress.NFTSwap, approved]
      );

      // 가스 관련 데이터 가져오기
      const feeData = await this.ethersProvider.getFeeData();

      // maxPriorityFeePerGas와 maxFeePerGas 설정
      const maxPriorityFeePerGas =
        feeData.maxPriorityFeePerGas || ethers.parseUnits("1", "gwei");
      const maxFeePerGas =
        feeData.maxFeePerGas ||
        (feeData.gasPrice
          ? feeData.gasPrice * BigInt(2)
          : ethers.parseUnits("20", "gwei"));

      const transactionParameters = {
        to: nftAddress,
        from: await this.getUserAddress(),
        data: data,
        // nonce: nonce,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        maxFeePerGas: maxFeePerGas,
      };

      const txHash = await this.provider.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      console.log(
        `Approval for all set to ${approved} successfully, transaction hash: ${txHash}`
      );
      return true;
    } catch (error) {
      console.error(`Approval 설정 실패 ${nftAddress}`, error);
      if (error.message) {
        console.error("Error message:", error.message);
      }
      if (error.code) {
        console.error("Error code:", error.code);
      }
      if (error.data) {
        console.error("Error data:", error.data);
      }
    }
  }

  async revokeApproval(nftAddress: string): Promise<boolean> {
    return this.setApprovalForAll(nftAddress, false);
  }

  private async isApprovedForAll(
    nftAddress: string,
    ownerAddress: string
  ): Promise<boolean> {
    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider);

      // NFT 컨트랙트의 ABI에서 isApprovedForAll 함수만 사용
      const nftContractABI = [
        "function isApprovedForAll(address owner, address operator) view returns (bool)",
      ];

      const nftContract = new ethers.Contract(
        nftAddress,
        nftContractABI,
        ethersProvider
      );

      return await nftContract.isApprovedForAll(
        ownerAddress,
        ContractAddress.NFTSwap
      );
    } catch (error) {
      console.error("Error checking approval status:", error);
      throw error;
    }
  }

  async getChainId(): Promise<any> {
    try {
      // For ethers v5
      // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const ethersProvider = new ethers.BrowserProvider(this.provider);
      // Get the connected Chain's ID
      const networkDetails = await ethersProvider.getNetwork();
      return networkDetails.chainId.toString();
    } catch (error) {
      return error;
    }
  }

  async getAccounts(): Promise<any> {
    try {
      // For ethers v5
      // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const ethersProvider = new ethers.BrowserProvider(this.provider);

      // For ethers v5
      // const signer = ethersProvider.getSigner();
      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = signer.getAddress();

      return await address;
    } catch (error) {
      return error;
    }
  }

  async getDalBalance(): Promise<any> {
    const signer = await this.ethersProvider.getSigner();
    const contract = new ethers.Contract(
      ContractAddress.Dal,
      ["function balanceOf(address account) view returns (uint256)"],
      signer
    );

    // Read message from smart contract
    const balance = await contract.balanceOf(signer.address);

    return parseFloat(ethers.formatEther(balance));
  }

  async getRandomItem(onStateChange?: (state: string) => void): Promise<any> {
    try {
      onStateChange?.("트랜잭션 시작...");

      const ethersProvider = new ethers.BrowserProvider(this.provider);
      const feeData = await ethersProvider.getFeeData();
      const gasPrice = feeData.gasPrice
        ? (feeData.gasPrice * BigInt(14)) / BigInt(10)
        : undefined;

      const signer = await ethersProvider.getSigner();

      const contract = new ethers.Contract(
        ContractAddress.PlayDuzzle,
        JSON.parse(JSON.stringify(PlayDuzzleAbi)),
        signer
      );

      onStateChange?.("트랜잭션을 전송하는 중...");
      const tx = await contract.getRandomItem({
        gasPrice,
      });
      onStateChange?.(`트랜잭션이 처리되고 있습니다...\n(예상 시간: 10-15초)`);

      const receipt = await tx.wait();
      onStateChange?.("아이템 정보를 가져오는 중...");

      const mintEvent = receipt?.logs.find(
        (e: any) => e.topics[0] === EventTopic.Mint
      );

      const tokenAddress = mintEvent?.address;
      const getMetadataUrl = async (tokenAddress: string) => {
        const abi =
          tokenAddress === ContractAddress.BlueprintItem
            ? BlueprintItemAbi
            : MaterialItemAbi;
        const iface = new ethers.Interface(abi);
        const decodedLog = iface.parseLog(mintEvent!);

        if (!decodedLog || !decodedLog.args) {
          throw new Error("Failed to decode mint event");
        }
        console.log("Decoded log args:", decodedLog.args);
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain, no-unsafe-optional-chaining
        const [, tokenId] = decodedLog?.args!;
        const tokenContract = new ethers.Contract(
          tokenAddress,
          JSON.parse(JSON.stringify(abi)),
          signer
        );
        const metadataUrl = await tokenContract.tokenURI(tokenId);

        return metadataUrl;
      };
      const metadataUrl = await getMetadataUrl(tokenAddress);
      console.log("metadataUrl: ", metadataUrl);
      console.timeEnd("getRandomItem");

      return metadataUrl;
    } catch (error) {
      console.error("Random Item Error:", error);
      throw error;
    }
  }

  async unlockPuzzlePiece(pieceId: number) {
    const ethersProvider = new ethers.BrowserProvider(this.provider);
    const signer = await ethersProvider.getSigner();

    const contract = new ethers.Contract(
      ContractAddress.PlayDuzzle,
      JSON.parse(JSON.stringify(PlayDuzzleAbi)),
      signer
    );

    const estimateGas = await contract.unlockPuzzlePiece.estimateGas(pieceId);

    const tx = await contract.unlockPuzzlePiece(pieceId, {
      gasLimit: estimateGas,
    });
    const receipt = await tx.wait();
    const mintEvent = receipt?.logs.find(
      (e: any) => e.topics[0] === EventTopic.Mint
    );

    const tokenAddress = mintEvent?.address;
    const getMetadataUrl = async (tokenAddress: string) => {
      const iface = new ethers.Interface(PuzzlePieceAbi);
      const decodedLog = iface.parseLog(mintEvent!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain, no-unsafe-optional-chaining
      const [, tokenId] = decodedLog?.args!;
      const tokenContract = new ethers.Contract(
        tokenAddress,
        JSON.parse(JSON.stringify(PuzzlePieceAbi)),
        signer
      );
      const metadataUrl = await tokenContract.tokenURI(tokenId);

      return metadataUrl;
    };
    const metadataUrl = await getMetadataUrl(tokenAddress);

    return metadataUrl;
  }
}
