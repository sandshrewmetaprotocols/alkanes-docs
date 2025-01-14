---
sidebar_position: 2
title: Interacting with Contracts
---

# Interacting with Contracts

This section covers how to interact with Alkane contracts and tokens. It covers the AlkaneId system, cellpacks, and how to interact with deployed contracts.

## Alkane IDs

Every Alkane (smart contract) has a unique identifier called an AlkaneId, structured as `[block, tx]` where both components are u128 numbers. Alkane IDs, also referred to as alkane addresses,are used to identify and interact with contracts as well as to perform system operations like deploying contracts.

:::info
While Alkanes uses block/transaction terminology, these numbers do not refer to actual bitcoin blocks and transactions.
:::

## Cellpacks / call data

A cellpack is a special type of message (call data) used to interact with Alkanes. Think of it as an envelope containing:

1. **Target** (first two numbers):
    - Either a standard [AlkaneId](#alkane-ids) of an existing contract
    - Or, a reserved system Alkane ID (e.g., [1, 0] is used to deploy a new contract)

2. **Inputs** (remaining numbers):
    - Additional data needed for the operation

Example Structure:

```
[Target_block, Target_tx, Input1, Input2, ...]
```

## Reserved call data IDs

There are several reserved call data IDs that are used for system operations, like deploying contracts.

**Single contract deploy** (`[1, 0]`)
- Deploys a new WASM contract
- Contract receives next available `[2, n]` Alkane ID

**Factory deploy** (`[3, n]`)
- Used to deploy a contract to a specific reserved number `n`
- The deployed contract will be assigned the `[4, n]` Alkane ID
- Commonly used for factory contracts

**Factory clone** (`[6, n]`)
- Clones contracts with `[4, n]` addresses (e.g., a factory contract)
- The deployed clone contract (the alkane token) will be assigned the next available `[2, n]` address



## Contract opcodes

Cellpacks are also used to interact with deployed contracts. In these cases, the first two numbers of the cellpack are the alkane address of the contract and the remaining numbers are the contract "opcodes" and input data for the functions associated with the opcodes.

Opcodes are like function selectors that tell a contract which action to perform. When you interact with an Alkane contract, you send:
1. The contract's AlkaneId
2. An opcode number (what action you want)
3. Any additional data the action needs

For example, in this contract we can see several available opcodes:

```rust
match shift_or_err(&mut inputs)? {
    0 => {    // Initialize the contract
        // Sets up the token with initial supply and ownership
    },
    77 => {   // Mint new tokens
        // Only the owner can mint additional tokens
    },
    99 => {   // Get token name
        // Returns the token's name
    },
    100 => {  // Get token symbol
        // Returns the token's symbol
    },
    101 => {  // Get total supply
        // Returns the total token supply
    },
}
```

In this example, the contract has an opcode for minting tokens, and several opcodes for getting information about the token. Setter opcodes, like the mint, require you to submit a transaction to bitcoin with the appropriate call data packed, in the form of a [protorune](protorunes), into an OP_RETURN output. Getter opcodes, like the token name, can be called directly from the contract without submitting a transaction using a "simulation" call.

### Sending a transaction

To mint tokens from an alkane token that has been deployed using this contract, you would:
- Target the token's address
- Use opcode `77` (the mint function)

```Typescript
const calldata = [
  BigInt(alkaneId.block),
  BigInt(alkaneId.tx),
  BigInt(77)
]
```

Then you would send the calldata to an appropriately formatted bitcoin transaction.

## Simulating a transaction 

You can call an Alkanes RPC `simulate` endpoint directly to get data from an alkane contract or token. For example, to get the name of a token deployed using the contract above, you would use the following call data:

```Typescript
alkanes.simulate({
  alkanes: [],
  transaction: '0x',
  block: '0x',
  height: '20000',
  txindex: 0,
  target: {
    block: alkaneId.block,
    tx: alkaneId.tx,
  },
  inputs: ['99'],
  pointer: 0,
  refundPointer: 0,
  vout: 0,
})
```


