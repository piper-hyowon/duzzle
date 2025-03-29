import { ZONES } from "./../constants/zones.constant";
import { ethers } from "hardhat";

const mappingMaterialItemTokenAddressToName = (address: string) => {
  switch (address) {
    case process.env.MATERIAL_ITEM_REDBRIK_CONTRACT_ADDRESS:
      return `${address} (붉은 벽돌)`;
    case process.env.MATERIAL_ITEM_SAND_CONTRACT_ADDRESS:
      return `${address} (모래)`;
    case process.env.MATERIAL_ITEM_HAMMER_CONTRACT_ADDRESS:
      return `${address} (망치)`;
    case process.env.MATERIAL_ITEM_GLASS_CONTRACT_ADDRESS:
      return `${address} (유리)`;
    case process.env.MATERIAL_ITEM_XMAS_STOCKING_CONTRACT_ADDRESS:
      return `${address} (크리스마스 양말)`;
    default:
      return address;
  }
};

async function fetchSeasonStatusReport() {
  const playDuzzleInstance = await ethers.getContractAt(
    "PlayDuzzle",
    process.env.PLAY_DUZZLE_CONTRACT_ADDRESS!
  );

  const allSeasonIds = await playDuzzleInstance.getAllSeasonIds();
  console.log("전시즌: ", allSeasonIds);

  const thisSeasonId = await playDuzzleInstance.thisSeasonId();
  console.log("이번 시즌: ", thisSeasonId);

  const dalTokenAddress = await playDuzzleInstance.dalToken();
  console.log("DAL 토큰 주소: ", dalTokenAddress);

  const blueprintItemAddress = await playDuzzleInstance.blueprintItemToken();
  console.log("설계도면 NFT 주소: ", blueprintItemAddress);

  const puzzlePieceAddress = await playDuzzleInstance.puzzlePieceToken();
  console.log("퍼즐 조각 NFT 주소: ", puzzlePieceAddress);

  const offset = await playDuzzleInstance.offset();
  console.log("offset", offset);

  console.log("\n\n");
  const thisSeasonItemMinted =
    await playDuzzleInstance.getItemMintedCountsBySeasonId(thisSeasonId);
  const [materialItemTokens, itemMaxSupplys, itemMinted, mintedBlueprint] =
    thisSeasonItemMinted;
  console.log("===이번 시즌 발행된 아이템 정보===");
  for (let i = 0; i < materialItemTokens.length; i++) {
    console.log(
      "재료",
      mappingMaterialItemTokenAddressToName(materialItemTokens[i]),
      "최대 공급량",
      itemMaxSupplys[i],
      "아이템 발행량",
      itemMinted[i],
      itemMaxSupplys[i] === itemMinted[i] ? "(모두 발행됨)" : ""
    );
  }

  const mintedBlueprintZones: number[] = [];
  const unmintedBlueprintZones: number[] = [];
  for (let i = 0; i < mintedBlueprint.length; i++) {
    if (mintedBlueprint[i]) {
      mintedBlueprintZones.push(i);
    } else {
      unmintedBlueprintZones.push(i);
    }
  }

  console.log("발행된 설계도면 zone ids", mintedBlueprintZones);
  console.log("미발행 설계도면 zone ids", unmintedBlueprintZones);

  console.log("\n\n");
  const thisSeasonPuzzlePieceMinted =
    await playDuzzleInstance.getPuzzlePieceMintedCountsBySeasonId(thisSeasonId);
  console.log(
    "===이번 시즌 퍼즐 조각 (발행량/최대 발행량)===",
    `${thisSeasonPuzzlePieceMinted[1]}/${thisSeasonPuzzlePieceMinted[0]}`
  );

  const thisSeasonData = await playDuzzleInstance.getDataBySeasonId(
    thisSeasonId
  );
  const [
    pieceCountOfZones,
    requiredItemsForMinting,
    requiredItemAmount,
    startedAt,
  ] = thisSeasonData;
  for (let i = 0; i < pieceCountOfZones.length; i++) {
    console.log(`====${i}=======${ZONES[i].nameKr}=========================`);
    console.log("퍼즐 조각 수", pieceCountOfZones[i]);

    for (let j = 0; j < requiredItemsForMinting[i].length; j++) {
      console.log(
        "필요한 재료",
        `${mappingMaterialItemTokenAddressToName(
          requiredItemsForMinting[i][j]
        )} ${requiredItemAmount[i][j]}개\n`
      );
    }
  }

  console.log("시즌 시작 시간", new Date(parseInt(startedAt) * 1000));
}

fetchSeasonStatusReport().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
