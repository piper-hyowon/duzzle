import { String } from 'aws-sdk/clients/cloudsearch';
import { EventTopicName } from 'src/module/repository/enum/transaction.enum';

export const EventTopic: { [key in EventTopicName]: string } = {
  [EventTopicName.Mint]:
    '0x0f6798a560793a54c3bcfe86a93cde1e73087d944c0ea20544137d4121396885',
  [EventTopicName.Transfer]:
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  [EventTopicName.Burn]:
    '0xcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5',
  [EventTopicName.StartSeason]:
    '0xcc42337061958f958a08d27f96d5a0a81074c25936db646bc1fb194fdb4ef30f',
  [EventTopicName.SetZoneData]:
    '0x103f24af39c7e7c12ee21ffed71c10dc9dba631749ee10f3a1a08470f3ff91e7',
  [EventTopicName.GetRandomItem]:
    '0x34009a12cdecbe310c9e38f088c4c86f14eff51a1981813090ff386ffa04960f',
};

export class CollectRangeDto {
  contractAddress: string[];
  fromBlock: number;
  toBlock?: number;
  topics?: string[];
}

export enum EVMApiMethod {
  GET_BLOCK = 'eth_getBlockByNumber',
}

export class GetBlockResponse {
  id: number | null;
  jsonrpc: string;
  result: {
    number: string; //  QUANTITY - the block number. null when its pending block.
    hash: string; //  DATA, 32 Bytes - hash of the block. null when its pending block.
    parentHash: string; //  DATA, 32 Bytes - hash of the parent block.
    nonce: string; //  DATA, 8 Bytes - hash of the generated proof-of-work. null when its pending block.
    sha3Uncles: string; //  DATA, 32 Bytes - SHA3 of the uncles data in the block.
    logsBloom: string; //  DATA, 256 Bytes - the bloom filter for the logs of the block. null when its pending block.
    transactionsRoot: string; //  DATA, 32 Bytes - the root of the transaction trie of the block.
    stateRoot: string; //  DATA, 32 Bytes - the root of the final state trie of the block.
    receiptsRoot: string; //  DATA, 32 Bytes - the root of the receipts trie of the block.
    miner: string; //  DATA, 20 Bytes - the address of the beneficiary to whom the mining rewards were given.
    difficulty: string; //  QUANTITY - integer of the difficulty for this block.
    totalDifficulty: string; //  QUANTITY - integer of the total difficulty of the chain until this block.
    extraData: string; //  DATA - the "extra data" field of this block.
    size: string; //  QUANTITY - integer the size of this block in bytes.
    gasLimit: string; //  QUANTITY - the maximum gas allowed in this block.
    gasUsed: string; //  QUANTITY - the total used gas by all transactions in this block.
    timestamp: string; //  QUANTITY - the unix timestamp for when the block was collated.
    transactions: any[]; //  Array - Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
    uncles: String[]; //  Array - Array of uncle hashes.
  };
}

export const JsonRpcSupportedVersion = '2.0'; // 현재 2.0 만 지원

export const MostRecentBlock = 'latest';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

interface ABI {
  anonymous?: boolean;
  inputs?: {
    name: string;
    type: string;
    indexed?: boolean;
    internalType?: string;
  }[];
  name: string;
  outputs?: { name: string; type: string }[];
  payable?: boolean;
  type: string;
}

export const TopicToAbi: { [topic in EventTopicName]?: ABI[] } = {
  [EventTopicName.Mint]: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'Mint',
      type: 'event',
    },
  ],
  [EventTopicName.Transfer]: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
  ],
};
