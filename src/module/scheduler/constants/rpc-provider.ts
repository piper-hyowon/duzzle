export enum RPCProvider {
  INFURA,
  DRPC,
  ANKR,
  CHAINSTACK,
}

export const ApiRequestLimits: {
  [key in RPCProvider]: {
    rps: number;
    maxBlockRange: number;
  };
} = {
  [RPCProvider.INFURA]: {
    rps: 10,
    maxBlockRange: 10_000,
    // 100,000 Total Requests/Day
  },
  [RPCProvider.DRPC]: {
    // https://drpc.org/docs/howitworks/ratelimiting
    rps: 1,
    maxBlockRange: 10_000,
  },
  [RPCProvider.ANKR]: {
    rps: 25, // 30
    maxBlockRange: 3_000,
  },
  [RPCProvider.CHAINSTACK]: {
    rps: 20, // 25
    maxBlockRange: 100,
    // 300,000 Total Requests/Month
    // 10,000 Requests/Day
  },
};
