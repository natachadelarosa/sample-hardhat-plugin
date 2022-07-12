# Tally Publish DAO

  Hardhat plugin to publish DAO on Tally


## What


This plugin will allow you to publish your DAO on Tally website right from your code editor.

## Installation

```bash
npm i @withtally/tally-publish-dao
```

Import the plugin in your `hardhat.config.js`:

```js
// Javascript
require('@withtally/tally-publish-dao');
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
// Typescript
import '@withtally/tally-publish-dao';
```


## Required plugins

- [@nomiclabs/hardhat-web3](https://github.com/nomiclabs/hardhat/tree/master/packages/hardhat-web3)
- [@nomiclabs/hardhat-ethers](https://github.com/NomicFoundation/hardhat/tree/master/packages/hardhat-ethers)

## Additional packages required

- [caip](https://www.npmjs.com/package/caip)
- [graphql](https://www.npmjs.com/package/graphql)
- [graphql-request](https://www.npmjs.com/package/graphql-request)
- [wretch](https://www.npmjs.com/package/wretch)

## Environment extensions

This plugin extends the `Hardhat Runtime Environment` by adding the `tally` property field whose type is `Tally`.

## Configuration

This plugin extends the `HardhatRuntimeEnvironment` and adds the `tally` property to it.

To set it just import the plugin in your hardhat configuration file like so:

```js
require('@withtally/tally-publish-dao');
```

```ts
import "@withtally/tally-publish-dao";
```

## Usage

There are no additional steps you need to take for this plugin to work.

Install it and access ethers through the Hardhat Runtime Environment anywhere
you need it (tasks, scripts, tests, etc).

Here's a using sample of the plugin in a task:

```ts
import { task } from "hardhat/config";
import { getExpectedContractAddress } from "../utils";


task("deploy:Dao").setAction(async function (_, { ethers, run, tally }) {
  // Token and governor deployments
  // ...

  await tally.publishDao({
    name: "My DAO",
    contracts: {
      governor: {
        address: governor.address,
        type: "OPENZEPPELINGOVERNOR",
      },
      token: {
        address: token.address,
        type: "ERC721", 
      }
    }
  })

// ...

});
```
