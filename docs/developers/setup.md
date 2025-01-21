---
sidebar_position: 3
title: Dev Environment
---

# Setting up your development environment

In this section, you will set up your local regtest development environment which you will use to build and test your Alkanes contract. The regtest environment uses several services to simulate a local Bitcoin network. These services are bundled into the [alkanes repository](https://github.com/kungfuflex/alkanes)

The alkanes docker build comprised of several bitcoin indexing services:

- bitcoind
- esplora
- ord
- metashrew
- alkanes

You will also install the Oyl SDK which supports command line interaction with the Alkanes regtest environment.

## Prerequisites

There are several requisites you will need:

- Docker
- Node 20+
- Yarn

## Alkanes

The [alkanes testing and development repository](https://github.com/kungfuflex/alkanes) contains everything you need to deploy and test a local version of your Alkanes contract. This section will guide you through the steps to get alkanes up and running.

### 1. Clone alkanes

```
git clone https://github.com/kungfuflex/alkanes --recurse-submodules
```

### 2. Build alkanes and run the docker container

```
yarn install
yarn build
docker compose build
```

**Note:** This docker compose has only been tested on Linux and MacOS systems. We currently do not guarantee support for Windows OS.

### 3. Launch the alkanes services

```
docker compose up -d
```

Alkanes should now be running in the background with an uninitialized regtest bitcoin instance. The alkanes RPC endpoint is:

```
http://localhost:18888/v1/regtest
```

It is now possible to call any of the RPC endpoints surfaced in the bitcoin, esplora, ord, and alkanes namespaces.

The full set of bitcoin, esplora, and ord RPC methods can be found in the [sandshrew documentation](https://docs.sandshrew.io/).

You can confirm the RPC endpoint by running:

```
curl http://localhost:18888/v2/regtest \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "btc_getblockcount",
    "params": []
}'
```

returns a block count:

```
{
  "jsonrpc": "2.0",
  "result": 0,
  "id": 1
}
```

## [Oyl SDK](/docs/developers/sdk)

You will use the utility methods in the Oyl SDK to support testing and deployment of your Alkanes contracts.

### 1. Clone oyl-sdk

```
git clone https://github.com/oyl-wallet/oyl-sdk
```

### 2. Install and test the SDK

```
yarn install
yarn test
```

The test will execute a number of jest test cases and that should all PASS.

### 3. Initialize the [Oyl CLI](/docs/developers/sdk/cli)

You will use Oyl's command line interface to deploy and test Alkane's contracts. The following updates your environment to support the Oyl CLI:

To install the `oyl` cli client, in the `oyl-sdk` root directory run:

```
npm install -g
```

### 4. Test the CLI

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

Now, test that the CLI is working by running a simple command that generates a mnemonic:

```
oyl account generateMnemonic

# fish invite model account aunt turn survey fit frog enforce replace frown
```

If you update the OYL SDK or CLI code you will need to rebuild the libraries:

```
make reset
```

## Using Regtest

Next, you will initialize your local bitcoin chain. The init command will process the first 260 blocks and will send BTC to a faucet address and a test wallet that will be used during testing.

The default mnemonics and addresses are in the `src/cli/constants.ts` file:

```
export const REGTEST_FAUCET = {
  mnemonic: 'hub dinosaur mammal approve riot rebel library legal sick discover loop alter',
  nativeSegwit: {
    address: 'bcrt1qzr9vhs60g6qlmk7x3dd7g3ja30wyts48sxuemv',
    publicKey: '03d3af89f242cc0df1d7142e9a354a59b1cd119c12c31ff226b32fb77fa12acce2'
  },
  taproot: {
    address: 'bcrt1p45un5d47hvfhx6mfezr6x0htpanw23tgll7ppn6hj6gfzu3x3dnsaegh8d',
    publicKey: '022ffc336daa8196f1aa796135a568b1125ba08c2879c22468effea8e4a0c4c8b9',
  }
}

export const TEST_WALLET = {
  mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  nativeSegwit: {
    address: 'bcrt1qcr8te4kr609gcawutmrza0j4xv80jy8zeqchgx',
    publicKey: ''
  },
  taproot: {
    address: 'bcrt1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqvg32hk',
    publicKey: '',
  }
}
```

### 1. Initialize the chain

Use the OYL CLI to initialize your local chain.

```
oyl regtest init
```

This will execute the blocks and send BTC to the test address.

### 2. Chain commands

You can now interact with your local alkanes (Bitcoin, Esplora, Ord) and Metsashrew instances.
For example, to confirm the UTXOs on the test address run:

```
oyl utxo addressUtxos -a bcrt1qcr8te4kr609gcawutmrza0j4xv80jy8zeqchgx -p regtest
```

You can also make direct calls to your local regtest instance:

```
curl http://localhost:18888/v2/regtest \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "esplora_address::txs",
    "params": [
      "bcrt1qcr8te4kr609gcawutmrza0j4xv80jy8zeqchgx"
    ]
  }'
```
