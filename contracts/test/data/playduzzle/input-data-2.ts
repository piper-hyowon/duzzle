import { SeasonDataInit } from "./input-data-class/season";

export const SimpleSeasonData: {
  seasonData1: SeasonDataInit;
} = {
  seasonData1: {
    existedItemCollections: [],
    newItemNames: ["red brick", "sand"],
    newItemSymbols: ["RBK", "SND"],
    newItemBaseUris: [
      `${process.env.DEV_BASE_URI}/rbk/`,
      `${process.env.DEV_BASE_URI}/snd/`,
    ],
    maxSupplys: [35, 34],
    pieceCountOfZones: [
      1, 2, 3, 1, 2, 1, 3, 3, 1, 1, 2, 3, 1, 1, 1, 2, 3, 2, 5, 1,
    ],
    requiredMaterialIndexesForMinting: [
      [0, 1], // zone0 필요한 재료: 재료0, 재료1
      [0], // zone1 필요한 재료: 재료0
      [1], // zone2 필요한 재료: 재료1
      [1], // zone3 필요한 재료: 재료1
      [0, 1], // zone4 필요한 재료: 재료0, 재료1
      [0, 1], // zone5 필요한 재료: 재료0, 재료1
      [0], // zone6 필요한 재료: 재료0
      [1], // zone7 필요한 재료: 재료1
      [0], // zone8 필요한 재료: 재료0
      [0], // zone9 필요한 재료: 재료0
      [0, 1], // zone10 필요한 재료: 재료0, 재료1
      [0], // zone11 필요한 재료: 재료0
      [0], // zone12 필요한 재료: 재료0
      [0, 1], // zone13 필요한 재료: 재료0, 재료1
      [0], // zone14 필요한 재료: 재료0
      [1], // zone15 필요한 재료: 재료1
      [1], // zone16 필요한 재료: 재료1
      [0], // zone17 필요한 재료: 재료0
      [0], // zone18 필요한 재료: 재료0
      [0], // zone19 필요한 재료: 재료0
    ],
    requiredMaterialAmounts: [
      [1, 1], // zone0: 재료x 1개, 재료y 1개씩 필요
      [2], // zone1: 재료x 2개
      [2], // zone2: 재료x 2개
      [1], // zone3: 재료x 1개
      [3, 1], // zone4: 재료x 3개 재료y 4개
      [2, 2], // zone5: 재료x 3개 재료y 4개
      [1], // zone6: 재료x 1개
      [2], // zone7: 재료x 1개
      [1], // zone8: 재료x 1개
      [1], // zone9: 재료x 1개
      [1, 2], // zone10: 재료x 1개
      [1], // zone11: 재료x 1개
      [1], // zone12: 재료x 1개
      [1, 1], // zone13: 재료x 1개
      [1], // zone14: 재료x 1개
      [1], // zone15: 재료x 1개
      [3], // zone16: 재료x 1개
      [1], // zone17: 재료x 1개
      [1], // zone18: 재료x 1개
      [2], // zone19: 재료x 1개
    ],
  },
} as const;

const data = SimpleSeasonData.seasonData1;
const requiredItemsOfMaterial0: number = data.pieceCountOfZones.reduce(
  (acc, pieceCount, zone) => {
    let i = data.requiredMaterialIndexesForMinting[zone].findIndex(
      (e) => e === 0
    );
    if (i >= 0) {
      return acc + data.requiredMaterialAmounts[zone][i] * pieceCount;
    }
    return acc;
  }
);

const requiredItemsOfMaterial1: number = data.pieceCountOfZones.reduce(
  (acc, pieceCount, zone) => {
    let i = data.requiredMaterialIndexesForMinting[zone].findIndex(
      (e) => e === 1
    );
    if (i >= 0) {
      return acc + data.requiredMaterialAmounts[zone][i] * pieceCount;
    }
    return acc;
  }
);

console.log("requiredItemsOfMaterial0: ", requiredItemsOfMaterial0); // 35
console.log("requiredItemsOfMaterial1: ", requiredItemsOfMaterial1); // 34
