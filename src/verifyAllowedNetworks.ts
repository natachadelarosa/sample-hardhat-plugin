import { ChainConfig, chains } from "./ChainConfig";

export const verifyAllowedNetworks = (
  network: string
): network is keyof ChainConfig => {
  return network in chains;
};
