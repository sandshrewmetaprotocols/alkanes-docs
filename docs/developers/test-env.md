---
sidebar_position: 3
title: Test Environments
---

# Working with the Alkanes Test Environments

Oyl supports several test environments:

- Regtest: A local environment for development and testing
- Oylnet: A shared regtest environment maintained by Oyl
- Signet: A full testnet environment

When developing Alkanes contracts, you will want to get familiar with the local regtest development environment. Regtest is the best way to build and test your contracts in a clean environment which is useful for test automation and for rapidly iterating on your contract logic.

If you are developing a dApp that will be used by other developers, you may want to leverage Oylnet as a shared development environment. There you can used already deployed test contracts and tokens to test your dApp.

Once you have your contract working in regtest and Oylnet, you can then deploy on Signet to allow for public testing and interaction with other applications that support Signet.

## Regtest

Regtest is a local environment for development and testing. Oyl provides a docker compose file to quickly spin up a local regtest instance. Refer to the [dev environment setup guide](/docs/developers/setup) for instructions on how to set up your development environment and spin up a local regtest instance.

## Oylnet

Oylnet is a shared regtest environment, maintained by Oyl, that can be used by developers to test out deployment of Alkanes contracts and tokens. This should be considered a shared development environment where you can point your dApps and other tools to do some initial testing.

Here's what you need to connect to Oylnet:

```javascript
  oylnet: {
    url: 'https://oylnet.oyl.gg',
    version: 'v2',
    projectId: 'regtest',
    networkType: 'regtest',
    network: bitcoin.networks.regtest,
  },
```

:::warning
Heads up: Oylnet isn't your permanent testnet. It's a shared regtest playground that might get reset at any time.
When that happens, it will nuke all deployed contracts and tokens.
:::

## Signet

Before you ape your contracts into mainnet, you'll want to battle-test them on [Signet](https://mempool.space/signet). Signet is a full testnet environment that is more reliable and stable than the traditional Bitcoin testnet. Unlike the regular testnet, Signet blocks are signed by trusted chads which results in:

- Consistent block times (approximately every 10 minutes)
- Zero chance of spam attacks nuking your testing
- More predictable testing environment
- Mainnet-like conditions without the mainnet stakes
- Test coins that hold their value (no more worthless testnet coin farming)

### Alkanes Indexer on Signet

Oyl's got your back with a fully maintained Alkanes Signet indexer. Hit up [https://signet.sandshrew.io](https://signet.sandshrew.io) to test your Alkanes contracts. You'll also find bitcoin core, esplora, and ord indexers ready to roll.

Here's your connection info for Signet:

```javascript
  signet: {
    url: 'https://signet.sandshrew.io',
    version: 'v2',
    projectId: 'lasereyes',
    networkType: 'signet',
    network: bitcoin.networks.testnet,
  },
```

:::info
This Signet RPC access is Oyl's gift to Alkanes devs - use it for Alkanes testing and we're good. Keep it clean, and it stays free. Abuse it, and well... things might change.
:::

All of this RPC indexer stuff is yet another part of the Oyl network called [Sandshrew](https://sandshrew.io) and it is worth checking out. To learn more about how to access the Signet RPC methods, check out the [Sandshrew docs](https://docs.sandshrew.io/sandshrew-namespaces/btc-standard-bitcoin-rpc).
