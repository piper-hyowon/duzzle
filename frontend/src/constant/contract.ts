export class ContractAddress {
  static get Dal(): string {
    return "0x8f1cCE8ab1ee34d3C27B7384e8Dc6E639F920da4";
  }

  static get PlayDuzzle(): string {
    return "0xcC8e834ED0fbF077Ac1544ccdBFa6F7b7cB0b958";
  }

  static get BlueprintItem(): string {
    return "0xA138d98d502478012CBDf1Ec95294d982EfE356b";
  }

  static get PuzzlePiece(): string {
    return "0xe9eE0FB75f7214E2301B47A3da6a088783531421";
  }

  static get MaterialItems(): string[] {
    return [
      "0x235014C8eBBc1a0E94C68d65adAAA9408A013A35", // red brick
      "0x73D24f126AF6112C20579De5A2571f5f3c1851aF", // sand
      "0xE12910381A2b62D06FDF01eE4cd33317E83bB6fB", // hammer
      "0xc58d671F87f2E7be5CD4016AA8B253Db8401301B", // glass
      "0xBc1351c028ab3dcf259f29971DeC78eB896fe7E1" // xmas stocking
    ];
  }

  static get NFTSwap(): string {
    return "0x3565DDcEc57CeA7F6B30C3234d5642878b072988";
  }
}

export enum EventTopic {
  Mint = "0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885",
  Transfer = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  Burn = "0xcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5",
  StartSeason = "0xcc42337061958f958a08d27f96d5a0a81074c25936db646bc1fb194fdb4ef30f",
  SetZoneData = "0x103f24af39c7e7c12ee21ffed71c10dc9dba631749ee10f3a1a08470f3ff91e7",
  GetRandomItem = "0x34009a12cdecbe310c9e38f088c4c86f14eff51a1981813090ff386ffa04960f",
}

export const ItemPrice = 2; // DAL
