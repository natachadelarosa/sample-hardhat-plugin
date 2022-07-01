// tslint:disable-next-line no-implicit-dependencies
import type { task as taskT } from "hardhat/config";
import type { CompilerInput } from "hardhat/types";

import { assert, expect } from "chai";
import {
  TASK_COMPILE,
  TASK_COMPILE_SOLIDITY_GET_COMPILER_INPUT,
} from "hardhat/builtin-tasks/task-names";

// custom
import { useEnvironment, deployContract, getRandomString } from "./helpers";
import { Tally } from "./Tally";

describe("Integration tests examples", function () {
  describe("Hardhat Runtime Environment extension", function () {
    this.timeout(2000000);

    before(function () {
      if (process.env.RUN_ETHERSCAN_TESTS !== "yes") {
        this.skip();
      } else {
        if (
          process.env.WALLET_PRIVATE_KEY === undefined ||
          process.env.WALLET_PRIVATE_KEY === ""
        ) {
          throw new Error("missing WALLET_PRIVATE_KEY env variable");
        }
      }
    });
    useEnvironment("hardhat-project");

    beforeEach(async function () {
      const mutation = getRandomString(this.hre);
      const { task }: { task: typeof taskT } = require("hardhat/config");

      // We replace placeholder strings in the compilation pipeline.
      // We need to override the task here since the Hardhat context
      // is only created just in time for the test. See useEnvironment in the helpers module.
      task(TASK_COMPILE_SOLIDITY_GET_COMPILER_INPUT).setAction(
        async (_, hre, runSuper) => {
          const solcInput: CompilerInput = await runSuper();
          for (const source of Object.values(solcInput.sources)) {
            source.content = source.content.replace(/placeholder/gu, mutation);
          }
          return solcInput;
        }
      );

      // We force compilation to make sure that Hardhat introduces a new random payload.
      await this.hre.run(TASK_COMPILE, { force: true, quiet: true });

      this.signers = await this.hre.ethers.getSigners();
    });

    it("Should add the tally field", function () {
      assert.instanceOf(this.hre.tally, Tally);
    });

    it("Should be able to add a DAO with newly created contracts", async function () {
      const deployedToken = await deployContract(
        "MyToken",
        [],
        this.hre,
        this.signers[0]
      );
      const deployedGovernor = await deployContract(
        "MyGovernor",
        [deployedToken],
        this.hre,
        this.signers[0]
      );

      this.tokenAddress = deployedToken;
      this.governorAddress = deployedGovernor;

      assert.equal(
        await this.hre.tally.publishDao({
          name: "Newly Created DAO",
          contracts: {
            governor: {
              address: deployedGovernor,
              type: "OPENZEPPELINGOVERNOR",
            },
            token: {
              address: deployedToken,
              type: "ERC20",
            },
          },
        }),
        true
      );
    });

    it("Should be able to add a new DAO with an existing token", async function () {
      const deployedGovernor = await deployContract(
        "MyGovernor",
        [this.tokenAddress],
        this.hre,
        this.signers[0]
      );

      assert.equal(
        await this.hre.tally.publishDao({
          name: "Yet another DAO",
          contracts: {
            governor: {
              address: deployedGovernor,
              type: "OPENZEPPELINGOVERNOR",
            },
            token: {
              address: this.tokenAddress,
              type: "ERC20",
            },
          },
        }),
        false
      );
    });

    it("Should error adding existing governor with existing token", async function () {
      assert.equal(
        await this.hre.tally.publishDao({
          name: "Yet another DAO",
          contracts: {
            governor: {
              address: this.governorAddress,
              type: "OPENZEPPELINGOVERNOR",
            },
            token: {
              address: this.tokenAddress,
              type: "ERC20",
            },
          },
        }),
        true
      );
    });
  });
});
