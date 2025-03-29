import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
require("dotenv").config({ path: "../.env" });

const CAP_OF_DAL_TOKEN = 1000000000;
const BLUEPRINT_BASE_URI = `${process.env.DEV_BASE_URI}/bp/`;
const PUZZLE_PIECE_BASE_URI = `${process.env.DEV_BASE_URI}/pp/`;

const PlayDuzzleModule = buildModule("PlayDuzzleModule", (m) => {
  const capOfDalToken = m.getParameter("capOfDalToken", CAP_OF_DAL_TOKEN);
  const blueprintBaseUri = m.getParameter(
    "blueprintBaseUri",
    BLUEPRINT_BASE_URI
  );
  const puzzlePieceBaseUri = m.getParameter(
    "puzzlePieceBaseUri",
    PUZZLE_PIECE_BASE_URI
  );

  const playDuzzle = m.contract("PlayDuzzle", [
    capOfDalToken,
    blueprintBaseUri,
    puzzlePieceBaseUri,
  ]);

  return { playDuzzle };
});

export default PlayDuzzleModule;
