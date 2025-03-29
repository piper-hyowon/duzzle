import {
  SeasonData,
  SetZoneDataParameters,
} from "../../test/data/playduzzle/input-data-class/season";
import { SimpleSeasonData } from "./input-data";
import { DefaultDuzzleData } from "../../test/data/playduzzle/input-data-class/constants";
import { EventTopic } from "../../test/enum/test";
import {
  Contract,
  ContractTransactionReceipt,
  ContractTransactionResponse,
  parseUnits,
  TransactionReceipt,
} from "ethers";
import { ethers } from "hardhat";

const playDuzzleContractAddress = "";
const WAIT_TIME = 10000; // 10 초
const MAX_RETRIES = 5;
const INITIAL_GAS_PRICE = 20; // gwei
const GAS_PRICE_INCREMENT = 5; // gwei
const TRANSACTION_TIMEOUT = 5 * 60 * 1000; // 5 분

async function setZoneDataWithRetry(
  playDuzzleContract: Contract,
  zoneDataParams: SetZoneDataParameters,
  nonce: number
): Promise<void> {
  let retries = 0;
  let success = false;

  while (!success && retries < MAX_RETRIES) {
    try {
      const gasPrice = parseUnits(
        (INITIAL_GAS_PRICE + retries * GAS_PRICE_INCREMENT).toString(),
        "gwei"
      );

      const tx = await playDuzzleContract.setZoneData(...zoneDataParams, {
        nonce: nonce,
        gasPrice: gasPrice,
      });

      console.log(`Transaction sent: ${tx.hash}`);

      const receipt = await waitForTransaction(tx);

      if (receipt.status === 1) {
        console.log(
          `setZoneData ${zoneDataParams[0]} done. Transaction hash: ${receipt.hash}`
        );
        success = true;
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error(`Error in setZoneData attempt ${retries}:`, error);
      retries++;
      if (retries >= MAX_RETRIES) {
        throw new Error(
          `Failed to set zone data after ${MAX_RETRIES} attempts`
        );
      }
      console.log(`Retrying in 10 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
    }
  }
}

async function waitForTransaction(
  tx: ContractTransactionResponse
): Promise<TransactionReceipt> {
  const timeoutPromise = new Promise((_resolve, reject) => {
    setTimeout(
      () => reject(new Error("Transaction timeout")),
      TRANSACTION_TIMEOUT
    );
  });

  const receiptPromise = tx.wait();

  return Promise.race([
    receiptPromise,
    timeoutPromise,
  ]) as Promise<ContractTransactionReceipt>;
}

async function main() {
  const [signer] = await ethers.getSigners();

  const playDuzzleContract = (
    await ethers.getContractFactory("PlayDuzzle")
  ).attach(playDuzzleContractAddress);

  const firstSeasonData = new SeasonData(SimpleSeasonData.seasonData1);

  const receipt = await (
    await playDuzzleContract.startSeason(
      ...firstSeasonData.startSeasonParameters
    )
  ).wait();

  const materialItemTokenAddresses: string[] = (receipt?.logs.find(
    (e: any) => e.topics[0] === EventTopic.StartSeason
  )).args[0];
  console.log("materialItemTokenAddresses: ", materialItemTokenAddresses);

  firstSeasonData.makeZoneDataParameters(materialItemTokenAddresses);
  let nonce = await ethers.provider.getTransactionCount(
    await signer.getAddress()
  );

  for (let i = 0; i < DefaultDuzzleData.ZoneCount; i++) {
    try {
      await setZoneDataWithRetry(
        playDuzzleContract,
        firstSeasonData.setZoneDataParametersArr![i],
        nonce++
      );
    } catch (error) {
      console.error(`Failed to set zone data for zone ${i}:`, error);
    }

    if (i < DefaultDuzzleData.ZoneCount - 1) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
