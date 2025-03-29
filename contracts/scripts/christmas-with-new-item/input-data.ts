import { SeasonDataInit } from "../../test/data/playduzzle/input-data-class/season";

/**
 * 0,정문・대학본부
 * 1,스머프동산
 * 2,인문사회관
 * 3,대강의동
 * 4,차미리사기념관
 * 5,학생회관
 * 6,도서관・대학원
 * 7,민주동산
 * 8,영근터
 * 9,덕우당
 * 10,테니스장
 * 11,유아교육관
 * 12,대운동장
 * 13,예술관
 * 14,자연관・비엔나숲
 * 15,약학관・아트홀
 * 16,덕성하나누리관 & 라온센터
 * 17,국제관
 * 18,"기숙사(가온 I관, 가온 II 관)"
 * 19,국제기숙사

 */
export const SimpleSeasonData: {
  seasonData1: SeasonDataInit;
} = {
  seasonData1: {
    existedItemCollections: [
      process.env.MATERIAL_ITEM_REDBRIK_CONTRACT_ADDRESS!,
      process.env.MATERIAL_ITEM_SAND_CONTRACT_ADDRESS!,
      process.env.MATERIAL_ITEM_HAMMER_CONTRACT_ADDRESS!,
      process.env.MATERIAL_ITEM_GLASS_CONTRACT_ADDRESS!,
    ],
    newItemNames: ["christmas-stocking"], // 신규 아이템: 양말(크리스마스 산타 양말)  - 전체 구역에서 1개씩 필요
    newItemSymbols: ["XSTOCK"],
    newItemBaseUris: [`${process.env.DEV_BASE_URI}/metadata/14/`],
    maxSupplys: [86 + 17, 43 + 9, 67 + 13, 31 + 7, 20 + 4], // 퍼즐 완성하는데 필요한 개수의 20% 를 추가로 발행
    pieceCountOfZones: [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ],
    requiredMaterialIndexesForMinting: [
      // zone 0,정문・대학본부 / 필요한 재료: 붉은 벽돌, 망치
      [0, 2, 4],

      // zone 1,스머프동산 / 필요한 재료: 모래, 망치
      [1, 2, 4],

      // zone 2,인문사회관 / 필요한 재료: 붉은 벽돌, 망치
      [0, 2, 4],

      // zone 3,대강의동 / 필요한 재료: 붉은 벽돌, 망치
      [0, 2, 4],

      // zone 4,차미리사기념관 / 필요한 재료: 붉은 벽돌, 망치, 유리
      [0, 2, 3, 4],

      // zone 5,학생회관 / 필요한 재료: 붉은 벽돌, 망치
      [0, 2, 4],

      // zone 6,도서관・대학원 / 필요한 재료: 붉은 벽돌, 망치
      [0, 2, 4],

      // zone 7,민주동산 / 필요한 재료: 모래
      [1, 4],

      // zone 8,영근터 / 필요한 재료: 모래
      [1, 4],

      // zone 9,덕우당 / 필요한 재료: 뷹운 벽돌, 모래, 망치
      [0, 1, 2, 4],

      // zone 10,테니스장 / 필요한 재료: 모래, 망치
      [1, 2, 4],

      // zone 11,유아교육관 / 필요한 재료: 망치, 유리
      [2, 3, 4],

      // zone 12,대운동장 / 필요한 재료: 모래
      [1, 4],

      // zone 13,예술관 / 필요한 재료: 붉은 벽돌, 망치
      [0, 2, 4],

      // zone 14,자연관・비엔나숲 / 필요한 재료: 붉은 벽돌, 모래, 망치
      [0, 1, 2, 4],

      // zone 15,약학관・아트홀 / 필요한 재료: 망치, 유리
      [2, 3, 4],

      // zone 16,덕성하나누리관 & 라온센터 / 필요한 재료: 붉은 벽돌, 망치, 유리
      [0, 2, 3, 4],

      // zone 17,국제관 / 필요한 재료: 붉은 벽돌, 모래, 망치
      [0, 1, 2, 4],

      // zone 18,"기숙사(가온 I관, 가온 II 관)" / 필요한 재료: 붉은 벽돌, 망치
      [0, 2, 4],

      // zone 19,국제기숙사 / 필요한 재료: 붉은 벽돌, 모래, 망치
      [0, 1, 2, 4],
    ],
    requiredMaterialAmounts: [
      [6, 3, 1], // zone 0, 정문・대학본부
      [3, 3, 1], // zone 1, 스머프동산
      [6, 6, 1], // zone 2, 인문사회관
      [9, 6, 1], // zone 3, 대강의동
      [6, 3, 6, 1], // zone 4, 차미리사기념관
      [9, 3, 1], // zone 5, 학생회관
      [9, 3, 1], // zone 6, 도서관・대학원
      [6, 1], // zone 7, 민주동산
      [6, 1], // zone 8, 영근터
      [6, 3, 3, 1], // zone 9, 덕우당
      [6, 6, 1], // zone 10, 테니스장
      [3, 6, 1], // zone 11, 유아교육관
      [6, 1], // zone 12, 대운동장
      [9, 6, 1], // zone 13, 예술관
      [4, 6, 6, 1], // zone 14, 자연관・비엔나숲
      [3, 9, 1], // zone 15, 약학관・아트홀
      [9, 6, 9, 1], // zone 16, 덕성하나누리관 & 라온센터
      [6, 3, 3, 1], // zone 17, 국제관
      [6, 3, 1], // zone 18, 기숙사(가온 I관, 가온 II 관)
      [6, 3, 3, 1], // zone 19, 국제기숙사
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

const requiredItemsOfMaterial2: number = data.pieceCountOfZones.reduce(
  (acc, pieceCount, zone) => {
    let i = data.requiredMaterialIndexesForMinting[zone].findIndex(
      (e) => e === 2
    );
    if (i >= 0) {
      return acc + data.requiredMaterialAmounts[zone][i] * pieceCount;
    }
    return acc;
  }
);

const requiredItemsOfMaterial3: number = data.pieceCountOfZones.reduce(
  (acc, pieceCount, zone) => {
    let i = data.requiredMaterialIndexesForMinting[zone].findIndex(
      (e) => e === 3
    );
    if (i >= 0) {
      return acc + data.requiredMaterialAmounts[zone][i] * pieceCount;
    }
    return acc;
  }
);

const requiredItemsOfMaterial4: number = data.pieceCountOfZones.reduce(
  (acc, pieceCount, zone) => {
    let i = data.requiredMaterialIndexesForMinting[zone].findIndex(
      (e) => e === 4
    );
    if (i >= 0) {
      return acc + data.requiredMaterialAmounts[zone][i] * pieceCount;
    }
    return acc;
  }
);

// console.log("requiredItemsOfMaterial0: ", requiredItemsOfMaterial0); // 86
// console.log("requiredItemsOfMaterial1: ", requiredItemsOfMaterial1); // 43
// console.log("requiredItemsOfMaterial2: ", requiredItemsOfMaterial2); // 67
// console.log("requiredItemsOfMaterial3: ", requiredItemsOfMaterial3); // 31
// console.log("requiredItemsOfMaterial4: ", requiredItemsOfMaterial4); // 20
