---
sidebar_position: 1
---

# Metaprotocols on Bitcoin

## What is a metaprotocol?

A metaprotocol is a set of rules and conditions for a state machine whose inputs are the complete and raw data of a block in a blockchain system, which are processed sequentially to evaluate the next confirmed state of the system. The state of a metaprotocol is derived entirely from the base consensus model of the underlying blockchain system, but may make use of the raw data in a way that the consensus engine does not, to define arbitrary objects and concepts which can only be viewed if you are parsing and evaluating chaindata in realtime from the host blockchain, to apply state changes and arrive at the latest state of the metaprotocol.

## Examples

### Ordinals (NFTs)

The best example of this, which brought great attention to the metaprotocol space on Bitcoin, is the ordinals metaprotocol, which defines a structure called an `inscription`. An inscription functions similarly to an NFT as we have seen them on smart contract platforms like Ethereum. The data that an inscription represents can be packed into Bitcoin transactions and interpreted by an ordinals metaprotocol indexer, then rendered in a browser or application.

### Runes

Metaprotocols also emerged on Bitcoin expressing standards for fungible tokens, which possess some limited functionality similar to ERC20 on Ethereum mainnet, primarily with functionality to possess and transfer units of user-defined tokens. A notorious implementation of this is the BRC20 token standard, which is built on the ordinals metaprotocol. More recently, the runes metaprotocol was designed and gained some adoption, with comparable features but designed using different mechanisms for the encoding and packing of protocol messages with transactions that interact with tokens.

## Building on Bitcoin data

In general, a metaprotocol relies on the ability for a user to pack arbitrary data into a transaction to deploy to the host blockchain, so that protocol messages for the metaprotocol can be sent to the underlying blockchain. An indexer for the metaprotocol can then read these protocol messages as it processes chaindata, to evaluate intents and state changes and update its database (index). An indexer should provide an API or interface where the user of the metaprotocol can view its state, whether it be his balances, others balances, or other arbitrary data the metaprotocol may define.

### The Witness Stack

There are few options available to metaprotocol architects as a means to append arbitrary data to a Bitcoin block. One way to do this is to make use of the technique used in the ordinals metaprotocol, where you concatenate a series of Bitcoin script PUSHDATA opcodes to the witness stack of a transaction input, where byte segments are surrounded by opcodes that make the executable code unreachable and effectively ignored by the Bitcoin VM. Using this technique, depending on the amount of Bitcoin the user is willing to spend to create a transaction, a Bitcoin block could theoretically be filled by this one transaction, and the entire 4MB of size available to a Bitcoin block (at the time of writing) can be occupied with arbitrary data. The caveat is that this type of technique requires two transactions to be accepted by the Bitcoin consensus model, but the benefit is that there is a large space available for possible protocol messages, and the cost per byte is the lowest possible cost across methods to supply data with a transaction.

### OP_RETURN

The other method to append data to a transaction only requires one transaction, but you are limited to 80 bytes of space. An output can be created with the Bitcoin transaction whose Bitcoin script segment begins with an OP_RETURN opcode, and the amount of value associated with this transaction can simply be 0. The output is considered unspendable by the Bitcoin consensus model, but PUSHDATA instructions that follow the OP_RETURN opcode are included in the blockchain, and the byte segment can be interpreted in any manner that a metaprotocol architect prefers.

## Programmability

The metaprotocol we present with this project makes use of a combination of these methods of data storage on Bitcoin, and it achieves what we believe to be the holy grail of a purely Bitcoin-native metaprotocol: a smart contract system on Bitcoin, where not only smart contracts are built as WASM binaries, but the indexer that evaluates them is built to WASM as well, and thus its state is verifiably reproducible.
