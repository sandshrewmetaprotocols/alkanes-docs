# Intro to Oyl SDK

The Oyl SDK is a TypeScript library that provides a set of functions for interacting with the Bitcoin network and Bitcoin metaprotocols.

## Installing the SDK

This section will guide you through the process of installing the Oyl SDK and the Oyl CLI.

### 1. Clone oyl-sdk

```
git clone https://github.com/oyl-wallet/oyl-sdk
```

### 2. Install the SDK and run unit tests

```
yarn install
yarn test
```

The test will execute a number of jest test cases and that should all PASS.

## Install the Oyl CLI

### 1. Initialize the [Oyl CLI](/docs/developers/sdk/cli)

You will use Oyl's command line interface to deploy and test Alkane's contracts. The following updates your environment to support the Oyl CLI:

To install the `oyl` cli client, in the `oyl-sdk` root directory run:

```
npm install -g
```

### 2. CLI help

You should now be able to access the Oyl CLI commands:

```
oyl --help

Usage: default [options] [command]

All functionality for oyl-sdk in a cli-wrapper

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  regtest         Regtest commands
  alkane          Functions for alkanes
  utxo            Examine utxos
  account         Manage accounts
  btc             Functions for sending bitcoin
  brc20           Functions for brc20
  collectible     Functions for collectibles
  rune            Functions for runes
  provider        Functions avaialble for all provider services
  marketplace     Functions for marketplace
  help [command]  display help for command
```

To get help on an individual command, add the --help parameter:

```
oyl account --help

Usage: default account [options] [command]

Manage accounts

Options:
  -h, --help                   display help for command

Commands:
  mnemonicToAccount [options]  Returns an account from a mnemonic
  sign [options]
  privateKeys [options]        Returns private keys for an account object
  generateMnemonic             Returns a new mnemonic phrase
  help [command]               display help for command
```

## Example commands
