import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NFTSwapModule = buildModule("NFTSwapModule", (m) => {
  const nftSwap = m.contract("NFTSwap");

  return { nftSwap };
});

export default NFTSwapModule;
