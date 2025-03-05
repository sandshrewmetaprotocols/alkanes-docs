---
sidebar_position: 2
title: Quickstart Guide
description: Get started with Alkanes development in minutes. Learn how to set up your environment, deploy your first smart contract, and build on Bitcoin with our step-by-step tutorial for developers.
keywords:
  - Alkanes tutorial
  - Bitcoin smart contract tutorial
  - Deploy Bitcoin contracts
  - Alkanes quickstart
  - Bitcoin development guide
  - Protorunes framework
  - Bitcoin regtest
  - Smart contract deployment
image: img/sandshrew.svg
---

# Quickstart Tutorial

Alkanes is a token-based smart contract metaprotocol built on the protorunes framework using the protorunes standard. In this section we will deploy a custom smart contract for distributing a new Alkanes token. The goal is to demonstrate the smart contract capabilities of Alkanes.

In this tutorial, you will:

1. Use the shared [Oylnet regtest environment](/docs/developers/test-env#oylnet) as your test environment
2. Install [the Oyl SDK](/docs/developers/sdk/alkanes) which provides a set of utilities for interacting with Bitcoin metaprotocols
3. Deploy an example [Alkanes contract](/docs/learn/alkanes)
4. Interact with your contract using the [Oyl SDK CLI](/docs/developers/sdk/cli)

## Install the Oyl SDK

If you have not already done so, get familiar with the [Oylnet test environment](/docs/developers/test-env#oylnet) and follow the instructions in the [Oyl SDK](/docs/developers/sdk) guide to install the Oyl SDK and CLI. We will be using the Oyl CLI to deploy and interact with an example Alkanes contract.

## Deploy a pre-compiled contract to Oylnet

You will be deploying an example Alkanes "Free Mint" contract to the shared Oylnet instance. The Free Mint contract is a simple [factory contract](/docs/learn/alkanes#alkanes-factory-contracts) that allows anyone to deploy and mint Alkanes tokens. We are deploying a factory contract because we only want to deploy the factory contract once, and then clone the factory contract to deploy new alkanes mintable tokens.

A version of the Free Mint contract is included in the [SDK](https://github.com/Oyl-Wallet/oyl-sdk/blob/main/src/cli/contracts/free_mint.wasm).

### 1. Create and fund your account

You can use the Oylnet faucet to fund your account with BTC. If you want to set up a new test account, you will need to create a new mnemonic and store it in your .env file.

To generate a new mnemonic, run the following command:

```bash
oyl account generateMnemonic
```

Add your mnemonic to your .env file. For example:

```bash
MNEMONIC="YOUR_MNEMONIC"
```

Add the Sandshrew development API key to your .env file:

```bash
SANDSHREW_PROJECT_ID=lasereyes
```

Next, you can view the index 0 addresses for your account by running the following command:

```bash
oyl account mnemonicToAccount -p oylnet
```

This will output address information for the different Bitcoin address types:

```
{
  taproot: {
    pubkey: '02d500764ad0679994e7653cebbc9f81f066f0116686b7c085a011fd38fec8796a',
    pubKeyXOnly: 'd500764ad0679994e7653cebbc9f81f066f0116686b7c085a011fd38fec8796a',
    address: 'bcrt1p62zjq4hl5fv645ljwhg57p489wwt2vkuqhkjm8kqgezwudl0cf6sp7wawl',
    hdPath: "m/86'/0'/0'/0/0"
  },
  nativeSegwit: {
    pubkey: '031787a643c5be2054bcc97ae8156baa5231b06d721751da5f7fe371e01021f3e9',
    address: 'bcrt1qnchjrv8rqh0u59tzfg58g8rtte57vlj9hur0ha',
    hdPath: "m/84'/0'/0'/0/0"
  },
  nestedSegwit: {
    pubkey: '03d45cf23013db5aaa381e6620a6f3fad0c6e380f1622ccf701cbd420e66a76e80',
    address: '2NCZFce8BHRtKLPLgmTNgFaYCHVwNwNEB38',
    hdPath: "m/49'/0'/0'/0/0"
  },
  legacy: {
    pubkey: '03f8fbb07e27bfc238f113fb2689cb12db67c77350f28e7cd24f1e916293f27fa4',
    address: 'mzBuUSVwvUqcJzqhHBESzqFN4CqLbZMSgi',
    hdPath: "m/44'/0'/0'/0/0"
  },
  spendStrategy: {
    addressOrder: [ 'nativeSegwit', 'nestedSegwit', 'legacy', 'taproot' ],
    utxoSortGreatestToLeast: true,
    changeAddress: 'nativeSegwit'
  },
  network: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bcrt',
    bip32: { public: 70617039, private: 70615956 },
    pubKeyHash: 111,
    scriptHash: 196,
    wif: 239
  }
}
```

Next, use the following command to send satoshis to your Native Segwit or Taproot address:

```bash
oyl regtest sendFromFaucet --to "YOUR_ADDRESS" -s 1000000 -p oylnet
```

You are now ready to deploy your first Alkanes token!

### 2. Generate a block

Blocks are not automatically mined when running on regtest, so you will need to mine some blocks after every transaction. The following command will generate 2 blocks:

```bash
oyl regtest genBlocks -p oylnet
```

### 3. Deploy the Free Mint wasm

Factory contracts are deployed with a specific [reserve number](/docs/developers/contracts-interaction#reserved-call-data-ids). The reserve number is a unique identifier for the factory contract.

The first step is to pick an integer reserver number for your contract. You'll need to remember and use this number when you clone the factory contract to deploy new alkanes mintable tokens. In the example below we have picked `33` as our reserve number.

To deploy the precompiled Free Mint contract wasm file to the Oylnet instance, run the following command from the root of the SDK:

```bash
oyl alkane new-contract -c ./src/cli/contracts/free_mint.wasm -data 3,33,100 -p oylnet
```

_Generate a block after deploying the contract_

```bash
oyl regtest genBlocks -p oylnet
```

This [CLI command](https://github.com/Oyl-Wallet/oyl-sdk/blob/main/src/cli/alkane.ts) uses default settings (mnemonic, fee rate, network) and reserve number `7` to deploy the contract using the SDK's `new-contract` command. It uses the [commit-reveal pattern](https://docs.ordinals.com/guides/wallet.html?highlight=reveal#creating-inscriptions), familiar to Ordinals developers, to deploy the contract.

The wasm deployment steps in the SDK are:

1. **Setup**

   - Creates wallet instance
   - Processes and compresses WASM contract

2. **Commit Phase**

   - Broadcasts commit transaction
   - Generates block and waits for confirmation

3. **Reveal Phase**

   - Broadcasts reveal transaction with factory calldata
     HINT: The calldata in the above example command consists of the alkaneId and the opcode. Where:
     ```
     AlkaneId: [
       3, - the block number
       7, - the tx index (or reserve number)
     ],
     Opcode: 100
     ```
   - Generates block and waits for confirmation

4. **Verification**
   - Verifies deployment and outputs contract trace

### 4. Deploy an Alkanes token

Now that you have deployed the Factory contract, you can deploy Alkanes tokens by pointing to the reserve number of the factory contract. To deploy an Alkanes token, choose a name and symbol for your tokena and run the following command from the root of the SDK. For the test mint example contract, limit your token name to fewer than 8 characters and your symbol to fewer than 3 characters.

Remember to use the same reserve number as you did when you deployed the factory contract!

```bash
oyl alkane new-token -pre 5000 -amount 1000 -c 100000 -name "MYTOKEN" -symbol "MTK" -resNumber 33 -p oylnet
```

_(Don't forget to generate a block!)_

This command will deploy a new token with the following parameters:

- **resNumber**: The reserve number of the factory contract
- **amount**: The amount of tokens mintable in one call
- **name**: The name of the token
- **symbol**: The symbol of the token
- **cap**: The supply cap of the token
- **pre**: Amount of tokens to premine to the deployer's address

You can optionally attach an image to the token using the `-i` flag:

```bash
oyl alkane new-token -pre 5000 -amount 1000 -c 100000 -name "MYTOKEN" -symbol "MT" -resNumber 33 -i ./src/cli/contracts/image.png -p oylnet
```

_(...generate a block)_

Attaching an image requires a commit and reveal phase where the image content is included in a witness script and the token call data is added to a op_return protostone outpoint.

We can now check the alkane tokens that have been deployed on Olynet. There is always an initial `DIESEL` token deployed to the regtest instance, so you should see it and the token you just deployed. Run the following command to see the list of deployed tokens:

```bash
oyl provider alkanes -method getAlkanes -params '{"limit": 20}' -p oylnet
```

**Take note of the AlkaneId of your token as you will need it when you mint tokens.** When tokens are deployed they are assigned the next available `[2, n]` Alkane Id.

Also, when you deployed the token, it premined 5000 MYTOKEN to your address. You can check the balance of your address by running the following command:

```bash
oyl provider alkanes -method getAlkanesByAddress -params '{"address":"YOUR_TAPROOT_ADDRESS"}' -p oylnet
```

### 5. Mint a token

Once the token is deployed, you can mint tokens by calling the an `execute` with the mint opcode and [AlkaneId](#alkane-ids) on the token contract. For example, to mint MYTOKEN (MTK) which has an AlkaneId of `[2, 14]` and a mint opcode of `77`, run the following command on CLI:

```bash
oyl alkane execute -data '2, 14, 77' -p oylnet
```

_(...and genBlocks)_

This command will mint 1000 (amount set in the new-token command) tokens to the caller's address.

### 6. Send a token

To transfer tokens, you can use the `send` command on the CLI. For example, to send 100 MTK tokens with an AlkaneId of `[2, 14]`, run the following command:

```bash
oyl alkane send -blk 2 -tx 14 -amt 100 -to RECEIVER_TAPROOT_ADDRESS -p oylnet
```

If you check your balance again, you will see that you now have a 1000 balance for the mint in addition to the 5000 premined tokens.

## Next steps

Congratulations! You've deployed your first Alkanes token and minted it to your address.

Now that you've seen how to deploy and interact with an Alkanes token, you can learn more about the [Alkanes protocol](/docs/learn/alkanes) and start building your own [Alkanes smart contracts](/docs/developers/contracts-building).

You will also want to check out how to set up your own [local regtest environment](/docs/developers/setup) so you can quickly iterate on and test your Alkanes smart contracts.
