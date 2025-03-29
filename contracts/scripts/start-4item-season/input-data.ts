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
    existedItemCollections: [],
    newItemNames: ["red brick", "sand", "hammer", "glass"],
    newItemSymbols: ["RBK", "SND", "HMR", "GLS"],
    newItemBaseUris: [
      `${process.env.DEV_BASE_URI}/4/`, // duzzle db 의 contract_id
      `${process.env.DEV_BASE_URI}/5/`,
      `${process.env.DEV_BASE_URI}/6/`,
      `${process.env.DEV_BASE_URI}/7/`,
    ],
    maxSupplys: [32, 19, 23, 11],
    pieceCountOfZones: [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ],
    requiredMaterialIndexesForMinting: [
      // zone 0,정문・대학본부 / 필요한 재료: 붉은 벽돌, 망치
      [0, 2],

      // zone 1,스머프동산 / 필요한 재료: 모래, 망치
      [1, 2],

      // zone 2,인문사회관 / 필요한 재료: 붉은 벽돌, 망치
      [0, 2],

      // zone 3,대강의동 / 필요한 재료: 붉은 벽돌, 망치
      [0, 2],

      // zone 4,차미리사기념관 / 필요한 재료: 붉은 벽돌, 망치, 유리
      [0, 2, 3],

      // zone 5,학생회관 / 필요한 재료: 붉은 벽돌, 망치
      [0, 2],

      // zone 6,도서관・대학원 / 필요한 재료: 붉은 벽돌, 망치
      [0, 2],

      // zone 7,민주동산 / 필요한 재료: 모래
      [1],

      // zone 8,영근터 / 필요한 재료: 모래
      [1],

      // zone 9,덕우당 / 필요한 재료: 뷹운 벽돌, 모래, 망치
      [0, 1, 2],

      // zone 10,테니스장 / 필요한 재료: 모래, 망치
      [1, 2],

      // zone 11,유아교육관 / 필요한 재료: 망치, 유리
      [2, 3],

      // zone 12,대운동장 / 필요한 재료: 모래
      [1],

      // zone 13,예술관 / 필요한 재료: 붉은 벽돌, 망치
      [0, 2],

      // zone 14,자연관・비엔나숲 / 필요한 재료: 붉은 벽돌, 모래, 망치
      [0, 1, 2],

      // zone 15,약학관・아트홀 / 필요한 재료: 망치, 유리
      [2, 3],

      // zone 16,덕성하나누리관 & 라온센터 / 필요한 재료: 붉은 벽돌, 망치, 유리
      [0, 2, 3],

      // zone 17,국제관 / 필요한 재료: 붉은 벽돌, 모래, 망치
      [0, 1, 2],

      // zone 18,"기숙사(가온 I관, 가온 II 관)" / 필요한 재료: 붉은 벽돌, 망치
      [0, 2],

      // zone 19,국제기숙사 / 필요한 재료: 붉은 벽돌, 모래, 망치
      [0, 1, 2],
    ],
    requiredMaterialAmounts: [
      [2, 1], // zone 0, 정문・대학본부 / 붉은 벽돌 1개, 망치 1개씩 필요
      [1, 1], // zone 1, 스머프동산 / 모래 1개, 망치 1개씩 필요
      [2, 2], // zone 2, 인문사회관 / 붉은 벽돌 1개, 망치 1개씩 필요
      [3, 2], // zone 3, 대강의동 / 붉은 벽돌 1개, 망치 1개씩 필요
      [2, 1, 2], // zone 4, 차미리사기념관 / 붉은 벽돌 1개, 망치 1개, 유리 1개씩 필요
      [3, 1], // zone 5, 학생회관 / 붉은 벽돌 1개, 망치 1개씩 필요
      [3, 1], // zone 6, 도서관・대학원 / 붉은 벽돌 1개, 망치 1개씩 필요
      [2], // zone 7, 민주동산 / 모래 1개씩 필요
      [2], // zone 8, 영근터 / 모래 1개씩 필요
      [2, 1, 1], // zone 9, 덕우당 / 붉은 벽돌 1개, 모래 1개, 망치 1개씩 필요
      [2, 2], // zone 10, 테니스장 / 모래 1개, 망치 1개씩 필요
      [1, 2], // zone 11, 유아교육관 / 망치 1개, 유리 1개씩 필요
      [6], // zone 12, 대운동장 / 모래 1개씩 필요
      [3, 2], // zone 13, 예술관 / 붉은 벽돌 1개, 망치 1개씩 필요
      [4, 2, 2], // zone 14, 자연관・비엔나숲 / 붉은 벽돌 1개, 모래 1개, 망치 1개씩 필요
      [1, 3], // zone 15, 약학관・아트홀 / 망치 1개, 유리 1개씩 필요
      [3, 2, 3], // zone 16, 덕성하나누리관 & 라온센터 / 붉은 벽돌 1개, 망치 1개, 유리 1개씩 필요
      [2, 1, 1], // zone 17, 국제관 / 붉은 벽돌 1개, 모래 1개, 망치 1개씩 필요
      [2, 1], // zone 18, 기숙사(가온 I관, 가온 II 관) / 붉은 벽돌 1개, 망치 1개씩 필요
      [2, 1, 1], // zone 19, 국제기숙사 / 붉은 벽돌 1개, 모래 1개, 망치 1개씩 필요
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

console.log("requiredItemsOfMaterial0: ", requiredItemsOfMaterial0); // 32
console.log("requiredItemsOfMaterial1: ", requiredItemsOfMaterial1); // 19
console.log("requiredItemsOfMaterial2: ", requiredItemsOfMaterial2); // 23
console.log("requiredItemsOfMaterial3: ", requiredItemsOfMaterial3); // 11
