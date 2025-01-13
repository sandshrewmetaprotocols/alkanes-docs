---
sidebar_position: 2
title: Interacting with Contracts
---

# Interacting with Contracts

## Alkane IDs

Alkane IDs 

Every Alkane (smart contract) has a unique identifier called an AlkaneId, structured as `[block, tx]` where both components are u128 numbers. 

Note: While Alkanes uses block/transaction terminology, these numbers do not refer to actual bitcoin blocks and transactions.

## Cellpacks

A cellpack is a special type of message used to interact with Alkanes. Think of it as an envelope containing:

1. **Target** (first two numbers):
   - Either a standard [AlkaneId](#understanding-alkane-ids) of an existing contract
   - Or, a reserved system Alkane ID (like `[1, 0]` to create a new contract)

2. **Inputs** (remaining numbers):
   - Additional data needed for the operation

Example Structure:

```
[Header1, Header2, Input1, Input2, ...]
```






There are several reserved block codes that are used for system operations, like deploying contracts:

**Standard contract addresses: `[2, n]`**
- All active contracts eventually get a `[2, n]` address
- Addresses start at `[2, 0]` and increment sequentially
- Used for regular contract deployments

**Reserved system addresses: `[4, n]`**
- Special addresses for factory contracts
- Can use any unused `n` value
- Often used for system-level contracts

### Standard contract addresses

**Direct Creation** (`[1, 0]`)
- Deploys a new WASM contract
- Contract receives next available `[2, n]` Alkane ID


### Factory contract addresses
   
**Factory reserved deploy** (`[3, n]`)
- Used to deploy a contract to a specific reserved number `n`
- The deployed contract will be assigned the `[4, n]` Alkane ID
- Commonly used for factory contracts

**Factory clone** (`[6, n]`)
- Clones contracts with `[4, n]` addresses (e.g., a factory contract)
- The deployed clone contract (the alkane token) will be assigned thenext available `[2, n]` address



## Contract opcodes

Opcodes are like function selectors that tell a contract which action to perform. When you interact with an Alkane contract, you send:
1. The contract's address (AlkaneId)
2. An opcode number (what action you want)
3. Any additional data the action needs

In this contract we can see several opcodes in action:

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

For example, to mint new tokens you would:
- Target this contract's address
- Use opcode `77` (the mint function)
- Include the amount of tokens to mint as an argument




## Simulating a transaction

## Sending a transaction



### Message Flow

Every Alkane interaction happens through a protocol message that can include:
- Asset transfers
- Edicts (commands)
- Pointers (references to other messages)
- Refund pointers (for returned assets)

This ensures all contract actions and asset movements are properly tracked and executed.

