---
sidebar_position: 1
---

# ALKANES

ALKANES implements a full smart contract environment on Bitcoin L1. ALKANES smart contracts are developed in Rust, compiled to WebAssembly (WASM), and are deployed as gzipped WASM files through witness reveal payloads, similar to ordinals inscriptions. The smart contract methods are executed through protocol messages encoded in OP_RETURN outputs which are structured similar to Runestones. Data for methods calls is stored in a Protocol field (tag 16383) within a Runestone, which enables the embedding of "Protostone" (contract execution) messages without disrupting the base Runes protocol. All of the indexing of Alakanes data and the execution of ALKANES smart contracts is done using "Metashrew" an open source indexing stack. 

Let's unpack this...

## ALKANES Smart Contracts

It utilizes WebAssembly (WASM) for both contract execution and indexing.

The execution environment supports contract-to-contract interactions, storage operations, and complex state transitions while maintaining Bitcoin's UTXO model. 

All contracts inherently function as transferable assets, enabling composability similar to ERC20 tokens in Ethereum's ecosystem.

## ALKANES, Ordinals, and Runes

ALKANES is built on top of Runes, a protocol that enables smart contract functionality on Bitcoin L1. It leverages Bitcoin's base layer blockchain and implements various techniques to facilitate smart contract creation and execution.

ALKANES inherits structures and design patterns from the ordinals and runes metaprotocol projects, authored by Casey Rodarmor. ALKANES utilizes a minimal variant of Ordinals' inscription witness envelope, which is used to deploy *.wasm.gz files to the Bitcoin blockchain, after which they can be transacted against as smart contract programs, using any combination of inputs of value, data, and the context of the transaction itself.

ALKANES also inherits functionality from the Runes metaprotocol. It uses the Runestone structure as defined in the runes specification, but in a way that is harmless to indexers tracking the state of runes.


## Metashrew

Metashrew is an open source indexing stack that powers ALKANES smart contracts. It was architected to reduce the problem of building a metaprotocol to architecting an executable that handles solely the logic of processing a single block. The executables follow a portable calling convention and are compatible with AssemblyScript, but can also, themselves, be written in C or Rust, or anything that builds to a WASM target.

Metashrew provides comprehensive infrastructure including:
- Block processing and state management with reorg detection
- A key-value store interface for contract state
- Parallel processing of view functions through its RPC layer
- WASM-based execution environment for both contracts and indexers
- Transaction simulation capabilities including fuel costs and state updates

For a detailed overview of Metashrew's architecture and capabilities, see [Metashrew](./metashrew.md).


## Protorunes

(TODO)
Protorunes is a protocol that allows for the creation and execution of smart contracts on Bitcoin L1. It is built on top of the Bitcoin L1 blockchain and uses a variety of techniques to enable smart contracts to be created and executed on Bitcoin L1.

