import { NomicLabsHardhatPluginError } from "hardhat/plugins";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import get from "lodash.get";

// custom
import { chains, TallyChainConfig } from "./ChainConfig";
import { pluginName } from "./constants";
import { getContractAddressStartBlock } from "./etherscan-api";
import { registerProtocol } from "./tally-api";
import { DaoToPublish } from "./types/tallyTypes";
import { verifyAllowedNetworks } from "./verifyAllowedNetworks";

export class Tally {
  hre: HardhatRuntimeEnvironment;

  constructor(hre: HardhatRuntimeEnvironment) {
    this.hre = hre;
  }

  public async publishDao(dao: DaoToPublish): Promise<boolean> {
    const { name: network } = this.hre.network;
    const { etherscan } = this.hre.config;

    const isNetworkAllowed = verifyAllowedNetworks(network);
    if (!isNetworkAllowed) {
      throw new NomicLabsHardhatPluginError(
        pluginName,
        `Network not allowed: ${network}`
      );
    }

    if (etherscan.apiKey) {
      const networkInformation = get(chains, network) as TallyChainConfig;

      const etherscanAPIKey = etherscan.apiKey;

      const governorStartBlock = await getContractAddressStartBlock(
        networkInformation.api,
        dao.contracts.governor.address,
        etherscanAPIKey
      );

      const tokenStartBlock = await getContractAddressStartBlock(
        networkInformation.api,
        dao.contracts.token.address,
        etherscanAPIKey
      );

      if (tokenStartBlock === "error" || governorStartBlock === "error") {
        throw new NomicLabsHardhatPluginError(
          pluginName,
          `There was an error getting contract start block.`
        );
      }

      const organization = {
        name: dao.name,
      };

      const token = {
        address: dao.contracts.token.address,
        type: dao.contracts.token.type,
        start: tokenStartBlock,
        chainId: networkInformation.id,
      };

      const governance = {
        address: dao.contracts.governor.address,
        type: dao.contracts.governor.type,
        start: governorStartBlock,
        chainId: networkInformation.id,
      };

      await registerProtocol({ organization, token, governance });

      return true;
    } else {
      throw new NomicLabsHardhatPluginError(
        pluginName,
        `Please setup etherscan plugin and add your etherscan key.`
      );
    }
  }
}
