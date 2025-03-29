import { ethers } from "hardhat";

async function fetchNftBaseUris(): Promise<void> {
  const blurpintItemInstacne = await ethers.getContractAt(
    "BlueprintItem",
    process.env.BLUEPRINT_ITEM_CONTRACT_ADDRESS!
  );

  console.log("설계도면 NFT: ", await blurpintItemInstacne.getBaseURI());

  const puzzlePieceInstance = await ethers.getContractAt(
    "PuzzlePiece",
    process.env.PUZZLE_PIECE_CONTRACT_ADDRESS!
  );
  console.log("퍼즐 조각 NFT: ", await puzzlePieceInstance.getBaseURI());

  const redbrick = await ethers.getContractAt(
    "MaterialItem",
    process.env.MATERIAL_ITEM_REDBRIK_CONTRACT_ADDRESS!
  );
  console.log("붉은 벽돌 NFT: ", await redbrick.getBaseURI());

  const sand = await ethers.getContractAt(
    "MaterialItem",
    process.env.MATERIAL_ITEM_SAND_CONTRACT_ADDRESS!
  );

  console.log("모래 NFT: ", await sand.getBaseURI());

  const hammer = await ethers.getContractAt(
    "MaterialItem",
    process.env.MATERIAL_ITEM_HAMMER_CONTRACT_ADDRESS!
  );

  console.log("망치 NFT: ", await hammer.getBaseURI());

  const glass = await ethers.getContractAt(
    "MaterialItem",
    process.env.MATERIAL_ITEM_GLASS_CONTRACT_ADDRESS!
  );

  console.log("유리 NFT: ", await glass.getBaseURI());
}

fetchNftBaseUris()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
