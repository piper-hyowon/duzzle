import {
  CHAIN_NAMESPACES,
  CustomChainConfig,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import { ModalConfig } from "@web3auth/modal";
import { OpenloginAdapterOptions } from "@web3auth/openlogin-adapter";

const rpcTarget = import.meta.env.VITE_RPC_TARGET;
const clientId =
  "BPbO-LorL6VnxrYGqX9WrY23EIN1cEEz9qR1Ir4npgxR8Yik9WfXh8_ic8o7en7yN7usdzHNYb8fEQxokEUzI_E";

export const Web3AuthParameters: {
  clientId: string;
  chainConfig: CustomChainConfig;
  web3AuthNetwork: string;
  openLoginAdapterOptions: OpenloginAdapterOptions;
  modalConfig: Record<string, ModalConfig>;
} = {
  clientId: clientId,

  chainConfig: {
    chainId: "0x13882", // Please use 0x1 for Mainnet
    rpcTarget: rpcTarget,
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    displayName: "Amoy",
    blockExplorerUrl: "https://www.oklink.com/amoy",
    ticker: "POL",
    tickerName: "POL",
  },
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  openLoginAdapterOptions: {
    loginSettings: {
      mfaLevel: "none",
      redirectUrl: window.location.origin,
    },
    adapterSettings: {
      network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
      clientId: clientId,
      uxMode: "redirect", // "redirect" | "popup"
      mfaSettings: {
        deviceShareFactor: {
          enable: true,
          priority: 1,
          mandatory: true,
        },
        backUpShareFactor: {
          enable: true,
          priority: 2,
          mandatory: true,
        },
        socialBackupFactor: {
          enable: true,
          priority: 3,
          mandatory: false,
        },
        passwordFactor: {
          enable: true,
          priority: 4,
          mandatory: false,
        },
      },
    },
  },
  modalConfig: {
    [WALLET_ADAPTERS.METAMASK]: {
      label: "METAMASK",
      showOnModal: true,
      showOnMobile: true,
    },
    [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
      label: "WALLET_CONNECT_V2",
      showOnModal: true,
      showOnMobile: true,
    },
    [WALLET_ADAPTERS.TORUS_EVM]: {
      label: "TORUS_EVM",
      showOnModal: true,
      showOnMobile: true,
    },
    [WALLET_ADAPTERS.OPENLOGIN]: {
      label: "openlogin",
      loginMethods: {
        github: {
          name: "github",
          showOnModal: false,
        },
        reddit: {
          name: "reddit",
          showOnModal: false,
        },
        discord: {
          name: "discord",
          showOnModal: false,
        },
        twitch: {
          name: "twitch",
          showOnModal: false,
        },
        line: {
          name: "line",
          showOnModal: false,
        },
        linkedin: {
          name: "linkedin",
          showOnModal: false,
        },
        weibo: {
          name: "weibo",
          showOnModal: false,
        },
        wechat: {
          name: "wechat",
          showOnModal: false,
        },
        farcaster: {
          name: "farcaster",
          showOnModal: false,
        },
      },
    },
  },
};
