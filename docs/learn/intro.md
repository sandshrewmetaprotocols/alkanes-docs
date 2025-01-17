---
title: What is Alkanes?
description: Technical Overview of the Alkanes Protocol
sidebar_position: 1
---

<div style={{
  aspectRatio: '2/1',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid var(--ifm-color-emphasis-200)',
  width: '100%',
  height: '100%',
  position: 'relative',
  marginTop: '20px',
}}>
  <video
    autoPlay
    loop
    playsInline
    muted
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }}
  >
    <source src="/video/hero.mp4" type="video/mp4" />
  </video>
</div>

# What is Alkanes?

Alkanes implements a full smart contract environment on Bitcoin L1. Alkanes smart contracts are developed in Rust, compiled to WebAssembly (WASM), and are deployed as gzipped WASM files through witness reveal payloads, similar to ordinals inscriptions. The smart contract methods are executed through protocol messages encoded in OP_RETURN outputs which are structured similar to Runestones. Data for methods calls is stored in a Protocol field (tag 16383) within a Runestone, which enables the embedding of "Protostone" (contract execution) messages without disrupting the base Runes protocol. All of the indexing of Alkanes data and the execution of Alkanes smart contracts is done using "Metashrew" an open source indexing stack.

Let's unpack this...

## Alkanes Smart Contracts

It utilizes WebAssembly (WASM) for both contract execution and indexing.

The execution environment supports contract-to-contract interactions, storage operations, and complex state transitions while maintaining Bitcoin's UTXO model.

All contracts inherently function as transferable assets, enabling composability similar to ERC20 tokens in Ethereum's ecosystem.

## Alkanes, Ordinals, and Runes

Alkanes is built on top of Runes, a protocol that enables smart contract functionality on Bitcoin L1. It leverages Bitcoin's base layer blockchain and implements various techniques to facilitate smart contract creation and execution.

Alkanes inherits structures and design patterns from the ordinals and runes metaprotocol projects, authored by Casey Rodarmor. Alkanes utilizes a minimal variant of Ordinals' inscription witness envelope, which is used to deploy \*.wasm.gz files to the Bitcoin blockchain, after which they can be transacted against as smart contract programs, using any combination of inputs of value, data, and the context of the transaction itself.

Alkanes also inherits functionality from the Runes metaprotocol. It uses the Runestone structure as defined in the runes specification, but in a way that is harmless to indexers tracking the state of runes.

## Metashrew

Metashrew is an open source indexing stack that powers Alkanes smart contracts. It was architected to reduce the problem of building a metaprotocol to architecting an executable that handles solely the logic of processing a single block. The executables follow a portable calling convention and are compatible with AssemblyScript, but can also, themselves, be written in C or Rust, or anything that builds to a WASM target.

Metashrew provides comprehensive infrastructure including:

- Block processing and state management with reorg detection
- A key-value store interface for contract state
- Parallel processing of view functions through its RPC layer
- WASM-based execution environment for both contracts and indexers
- Transaction simulation capabilities including fuel costs and state updates

For a detailed overview of Metashrew's architecture and capabilities, see [Metashrew](./metashrew.md).
