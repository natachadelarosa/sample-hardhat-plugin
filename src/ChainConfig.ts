import wretch, { Wretcher } from "wretch";

export interface TallyChainConfig {
  id: string;
  name: string;
  chain: string;
  api: Wretcher;
}

export const chains = {
  mainnet: {
    id: "eip155:1",
    name: "Ethereum Network",
    chain: "ETH",
    api: wretch().url("https://api.etherscan.io"),
  },
  rinkeby: {
    id: "eip155:4",
    name: "Ethereum Testnet Rinkeby",
    chain: "ETH",
    api: wretch().url("https://api-rinkeby.etherscan.io"),
  },
  kovan: {
    id: "eip155:42",
    name: "Kovan",
    chain: "ETH",
    api: wretch().url("https://api-kovan.etherscan.io"),
  },
  optimisticEthereum: {
    id: "eip155:10",
    name: "Optimism",
    chain: "ETH",
    api: wretch().url("https://api-optimistic.etherscan.io"),
  },
  polygon: {
    id: "eip155:137",
    name: "Matic(Polygon) Mainnet",
    chain: "Matic(Polygon)",
    api: wretch().url("https://api.polygonscan.com"),
  },
  avalanche: {
    id: "eip155:43114",
    name: "Avalanche Mainnet",
    chain: "AVAX",
    api: wretch().url("https://api.snowtrace.io"),
  },
  optimisticKovan: {
    id: "eip155:69",
    name: "Optimism Kovan",
    chain: "ETH",
    api: wretch().url("https://api-kovan-optimistic.etherscan.io"),
  },
  polygonMumbai: {
    id: "eip155:80001",
    name: "Polygon Testnet Mumbai",
    chain: "Polygon",
    api: wretch().url("https://api-testnet.polygonscan.com"),
  },
  avalancheFujiTestnet: {
    id: "eip155:43113",
    name: "Avalanche Fuji Testnet",
    chain: "AVAX",
    api: wretch().url("https://api-testnet.snowtrace.io"),
  },
};

type Chain =
  | "mainnet"
  | "ropsten"
  | "rinkeby"
  | "goerli"
  | "kovan"
  | "sepolia"
  // binance smart chain
  | "bsc"
  | "bscTestnet"
  // huobi eco chain
  | "heco"
  | "hecoTestnet"
  // fantom mainnet
  | "opera"
  | "ftmTestnet"
  // optimistim
  | "optimisticEthereum"
  | "optimisticKovan"
  // polygon
  | "polygon"
  | "polygonMumbai"
  // arbitrum
  | "arbitrumOne"
  | "arbitrumTestnet"
  // avalanche
  | "avalanche"
  | "avalancheFujiTestnet"
  // moonbeam
  | "moonbeam"
  | "moonriver"
  | "moonbaseAlpha"
  | "harmony"
  | "harmonyTest"
  // xdai
  | "xdai"
  | "sokol"
  // aurora
  | "aurora"
  | "auroraTestnet";

export type ChainConfig = {
  [Network in Chain]: TallyChainConfig;
};
