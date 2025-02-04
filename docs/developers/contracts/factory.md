---
sidebar_label: 'Alkane Factory'
sidebar_position: 3
---

# Alkane Factory: Contract Factory

Alkane [factory contracts](https://alkanes.build/docs/learn/alkanes#alkanes-factory-contracts) are templates for alkanes that are meant to be factory instantiated with an attached witness envelope for content.

Tokens adhere to the alkane token format for fully qualified tokens, with name(), symbol(), and data().

The wasm files contain the bytecode and deployment logic for creating new Alkanes token contracts. Rather than directly deploying each token contract, users interact with the factory, which handles the creation process. The factory uses Alkanes's FACTORYRESERVED opcode to deploy new contract instances, typically taking parameters like token name, symbol, total supply, and mint parameters.

There are several factory contracts available in the alkane-factory repository, each with their own unique functionality.

## Repository

For implementation details and source code, visit the [Alkane Factory repository](https://github.com/kungfuflex/alkane-factory).

## [Free Mint Factory Contract](https://github.com/kungfuflex/alkane-factory/blob/master/alkanes/free-mint/src/lib.rs)

This contract implements a free-mint token system. It allows users to create (mint) tokens with configurable parameters like the value per mint, a supply cap, basic token metadata (name and symbol), and image data deployed to a witness envelope.

This contract is an [alkane factory contract](https://alkanes.build/docs/learn/alkanes#alkanes-factory-contracts) that enables the deployment of alkanes tokens that inherit from this contract.

### Opcodes

- 0: `initialize(mint_auth_token_amount: u128, mint_amount: u128)`
- 77: `mint(token_units: u128)`
- 99: `name(): String`
- 100: `symbol(): String`
- 101: `total_supply(): u128`
- 102: `cap(): u128`
- 103: `minted(): u128`
- 104: `value_per_mint(): u128`
- 1000: `data(): Vec<u8>`

### Usage

The first step is to build and deploy the free-mint wasm to a witness envelope in a bitcoin reveal transaction. A [reserve number](https://alkanes.build/docs/developers/contracts-interaction#reserved-call-data-ids) which will be used to identify the base contract when deploying a free-mint alkane token.

Here we deploy the free-mint wasm file with a reserve number of 7.

```
calldata: [
   BigInt(3),
   BigInt(7),
   BigInt(100),
]
```

This will deploy the contract with a [4, 7] Alkane ID.

```
calldata = [
   BigInt(6),     // FACTORYRESERVED - Used to clone contracts (wasms) deployed at [4, n]
   BigInt(7),     // So we are cloning the wasm deployed at [4, 7]
   BigInt(0),     // 0 opcode on the free-mint wasm signals initialization for the clone
   BigInt(2000),  // premine amount sent when the token contract is deployed
   BigInt(1000),  // amount per mint
   BigInt(21000), // cap (max number of mints) 0 is infinite supply
   BigInt('0x' + Buffer.from(TokenName).reverse().toString('hex')),
   BigInt('0x' + Buffer.from(TokenSymbol).reverse().toString('hex')),
]
```

## [Owned Token Factory Contract](https://github.com/kungfuflex/alkane-factory/blob/master/alkanes/owned-token/src/lib.rs)

This contract implements a owned-token minting system. It restricts the minting of tokens to the owner of the cloned token contract.

This contract is an [alkane factory contract](https://alkanes.build/docs/learn/alkanes#alkanes-factory-contracts) that enables the deployment of alkanes tokens that inherit from this contract.

### Opcodes

- 0: `initialize(mint_auth_token_amount: u128, mint_amount: u128)`
- 77: `mint(token_units: u128)`
- 99: `name(): String`
- 100: `symbol(): String`
- 1000: `data(): Vec<u8>`

### Usage

The first step is to deploy the owned-token wasm to a witness envelope in a bitcoin reveal transaction. A [reserve number](https://alkanes.build/docs/developers/contracts-interaction#reserved-call-data-ids) which will be used to identify the base contract when deploying a free-mint alkane token.

Here we deploy the free-mint wasm file with a reserve number of 8.

```
calldata: [
   BigInt(3),
   BigInt(8),
   BigInt(100),
]
```

This will deploy the contract with a [4, 8] Alkane ID.

```
calldata = [
   BigInt(6),     // FACTORYRESERVED - Used to clone contracts (wasms) deployed at [4, n]
   BigInt(8),     // So we are cloning the wasm deployed at [4, 8]
   BigInt(0),     // 0 opcode on the free-mint wasm signals initialization for the clone
   BigInt('0x' + Buffer.from(TokenName).reverse().toString('hex')),
   BigInt('0x' + Buffer.from(TokenSymbol).reverse().toString('hex')),
]
```
