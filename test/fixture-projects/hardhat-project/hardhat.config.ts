// We load the plugin here.
import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";

import "../../../src/index";

dotenvConfig({ path: resolve(__dirname, "./.env") });

// Ensure that we have all the environment variables we need.
const mnemonic: string | undefined = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  defaultNetwork: "hardhat",
  paths: {
    newPath: "asd",
  },
  etherscan: { apiKey: process.env.ETHERSCAN_API_KEY },
  networks: {
    rinkeby: {
      accounts: {
        count: 10,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      chainId: 4,
      url: process.env.TESTNET_URL,
    },
  },
};

export default config;
