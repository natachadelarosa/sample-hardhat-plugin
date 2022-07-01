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

<_The list of all the required Hardhat plugins if there are any_>

- [@nomiclabs/hardhat-web3](https://github.com/nomiclabs/hardhat/tree/master/packages/hardhat-web3)
- [@nomiclabs/hardhat-ethers](https://github.com/NomicFoundation/hardhat/tree/master/packages/hardhat-ethers)

## Tasks

<_A description of each task added by this plugin. If it just overrides internal 
tasks, this may not be needed_>

This plugin creates no additional tasks.

<_or_>

This plugin adds the _example_ task to Hardhat:
```
output of `npx hardhat help example`
```

## Environment extensions

<_A description of each extension to the Hardhat Runtime Environment_>

This plugin extends the Hardhat Runtime Environment by adding an `example` field
whose type is `ExampleHardhatRuntimeEnvironmentField`.

## Configuration

<_A description of each extension to the HardhatConfig or to its fields_>

This plugin extends the `HardhatUserConfig`'s `ProjectPathsUserConfig` object with an optional
`newPath` field.

This is an example of how to set it:

```js
module.exports = {
  paths: {
    newPath: "new-path"
  }
};
```

## Usage

<_A description of how to use this plugin. How to use the tasks if there are any, etc._>

There are no additional steps you need to take for this plugin to work.

Install it and access ethers through the Hardhat Runtime Environment anywhere
you need it (tasks, scripts, tests, etc).
