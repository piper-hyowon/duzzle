require("dotenv").config({ path: "../.env" });

export class DefaultDuzzleData {
  static get ZoneCount(): number {
    return 20;
  }

  static get MaxTotalSupplyOfDalToken(): number {
    return 1_000_000;
  }

  static get BlueprintBaseUri(): string {
    return `${process.env.DEV_BASE_URI}/v1/blueprint`;
  }

  static get PuzzlePieceBaesUri(): string {
    return `${process.env.DEV_BASE_URI}/v1/puzzlepiece`;
  }
}
