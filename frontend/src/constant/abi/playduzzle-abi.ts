export const PlayDuzzleAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "capOfDalToken",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "bluePrintBaseUri",
        type: "string",
      },
      {
        internalType: "string",
        name: "puzzlePieceBaseUri",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AccessControlBadConfirmation",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "neededRole",
        type: "bytes32",
      },
    ],
    name: "AccessControlUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnoughBalanceOfBlueprintItem",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnoughBalanceOfMaterialItem",
    type: "error",
  },
  {
    inputs: [],
    name: "SeasonIdNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "SoldOutItems",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "zoneId",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "pieceCountOfZones",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "requiredItemsForMinting",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint8[]",
        name: "requiredItemAmount",
        type: "uint8[]",
      },
    ],
    name: "SetZoneData",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract MaterialItem[]",
        name: "itemAddresses",
        type: "address[]",
      },
    ],
    name: "StartSeason",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "zoneId",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "UnlockPuzzlePiece",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "blueprintItemToken",
    outputs: [
      {
        internalType: "contract BlueprintItem",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "dalToken",
    outputs: [
      {
        internalType: "contract Dal",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllSeasonIds",
    outputs: [
      {
        internalType: "uint8[]",
        name: "_seasonIds",
        type: "uint8[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "id",
        type: "uint8",
      },
    ],
    name: "getDataBySeasonId",
    outputs: [
      {
        internalType: "uint8[20]",
        name: "pieceCountOfZones",
        type: "uint8[20]",
      },
      {
        internalType: "address[][]",
        name: "requiredItemsForMinting",
        type: "address[][]",
      },
      {
        internalType: "uint8[][]",
        name: "requiredItemAmount",
        type: "uint8[][]",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "id",
        type: "uint8",
      },
    ],
    name: "getItemMintedCountsBySeasonId",
    outputs: [
      {
        internalType: "contract MaterialItem[]",
        name: "materialItemTokens",
        type: "address[]",
      },
      {
        internalType: "uint16[]",
        name: "itemMaxSupplys",
        type: "uint16[]",
      },
      {
        internalType: "uint16[]",
        name: "itemMinted",
        type: "uint16[]",
      },
      {
        internalType: "bool[]",
        name: "mintedBlueprint",
        type: "bool[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "id",
        type: "uint8",
      },
    ],
    name: "getPuzzlePieceMintedCountsBySeasonId",
    outputs: [
      {
        internalType: "uint24",
        name: "totalPieceCount",
        type: "uint24",
      },
      {
        internalType: "uint24",
        name: "mintedCount",
        type: "uint24",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRandomItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "offset",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "puzzlePieceToken",
    outputs: [
      {
        internalType: "contract PuzzlePiece",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "callerConfirmation",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    name: "seasons",
    outputs: [
      {
        internalType: "uint24",
        name: "totalPieceCount",
        type: "uint24",
      },
      {
        internalType: "uint24",
        name: "mintedCount",
        type: "uint24",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "zoneId",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "pieceCount",
        type: "uint8",
      },
      {
        internalType: "address[]",
        name: "requiredItemsForMinting",
        type: "address[]",
      },
      {
        internalType: "uint8[]",
        name: "requiredItemAmount",
        type: "uint8[]",
      },
    ],
    name: "setZoneData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "existedItemCollections",
        type: "address[]",
      },
      {
        internalType: "string[]",
        name: "newItemNames",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "newItemSymbols",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "newItemBaseUris",
        type: "string[]",
      },
      {
        internalType: "uint16[]",
        name: "maxSupplys",
        type: "uint16[]",
      },
      {
        internalType: "uint24",
        name: "_totalPieceCount",
        type: "uint24",
      },
    ],
    name: "startSeason",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "thisSeasonId",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "pieceId",
        type: "uint256",
      },
    ],
    name: "unlockPuzzlePiece",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
