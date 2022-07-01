import { resetHardhatContext } from "hardhat/plugins-testing";
import { HardhatRuntimeEnvironment, FactoryOptions } from "hardhat/types";
import dotenv from "dotenv";

import path from "path";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

dotenv.config();
declare module "mocha" {
  interface Context {
    hre: HardhatRuntimeEnvironment;
    signers: SignerWithAddress[];
    tokenAddress: string;
    governorAddress: string;
  }
}

export function useEnvironment(fixtureProjectName: string) {
  beforeEach("Loading hardhat environment", function () {
    process.chdir(path.join(__dirname, "fixture-projects", fixtureProjectName));
    process.env.HARDHAT_NETWORK = "rinkeby";
    this.hre = require("hardhat");
  });

  afterEach("Resetting hardhat", function () {
    resetHardhatContext();
  });
}

export async function deployContract(
  contractName: string,
  constructorArguments: any[],
  { ethers }: HardhatRuntimeEnvironment,
  signer: SignerWithAddress,
  confirmations: number = 5,
  options: FactoryOptions = {}
): Promise<string> {
  if (options.signer === undefined) {
    if (process.env.WALLET_PRIVATE_KEY === undefined) {
      throw new Error("No wallet or signer defined for deployment.");
    }
    options.signer = signer;
  }

  const factory = await ethers.getContractFactory(contractName, options);
  const contract = await factory.deploy(...constructorArguments);
  await contract.deployTransaction.wait(confirmations);
  return contract.address;
}

export function getRandomString({ ethers }: HardhatRuntimeEnvironment): string {
  return ethers.Wallet.createRandom().address;
}
