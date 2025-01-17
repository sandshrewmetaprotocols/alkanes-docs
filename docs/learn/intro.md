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

Alkanes implements a full smart contract environment on Bitcoin L1. Alkanes smart contracts are developed in Rust, compiled to WebAssembly (WASM), and are deployed as gzipped WASM files through witness reveal payloads, similar to ordinals inscriptions. 

The smart contract methods are executed through [Protorunes](#protorunes) protocol messages encoded in OP_RETURN outputs which are structured similar to Runestones. Data for method calls is stored in a field (tag 16383) within a Runestone, which enables the embedding of [Protostone](/docs/developers/protorunes#protostone) (contract execution) messages without disrupting the base Runes protocol. 

All of the indexing of Alkanes data and the execution of Alkanes smart contracts is done using the [Metashrew](#metashrew) open source indexing stack.

Let's unpack this...

## Alkanes Smart Contracts

Alkanes smart contracts are self-executing contracts that hold the business logic of decentralized applications (dApps), executing pre-defined rules based on the state of the Bitcoin blockchain and triggering actions when specific conditions are met. Alkanes smart contracts are WASM-based contracts that are deployed as gzipped WASM files through witness reveal payloads. Alkanes contract methods are called through Protorune commands encoded in OP_RETURN outputs.

[Alkanes contracts](/docs/developers/contracts-building) follow a structured pattern where each contract implements some common interfaces and manages state through a key-value storage system. Contracts use [numeric opcodes](/docs/developers/contracts-building#contract-opcodes) to determine which actions to execute, with a standardized pattern for initialization, core functionality, administrative actions, and queries.

Contract interaction happens through [cellpacks](/docs/developers/contracts-interaction#cellpacks--call-data) - specially formatted messages that contain a target AlkaneId (structured as [block, tx] pairs) and input data. The system uses reserved AlkaneIds for system operations like contract deployment and factory cloning, while regular contract interactions use opcodes to invoke specific functions. Contracts can be interacted with either through actual Bitcoin [transactions](/docs/developers/contracts-interaction#sending-a-transaction) (for state changes) or through [simulation](/docs/developers/contracts-interaction#simulating-a-transaction) calls (for reading data), providing a flexible way to both modify and query contract state.

## Protorunes

Alkanes is built on top of Protorunes, a [specification](/docs/developers/protorunes) for building bitcoin metaprotocols. Protorunes inherits structures and design patterns from the [runes](https://docs.ordinals.com/runes/specification.html) metaprotocol project, authored by Casey Rodarmor. 

Protorunes messages, or [protostones](/docs/developers/protorunes#protostone), hold the logic for intracting with Alkanes smart contracts as well as more general logic for transferring and minting assets like Alkanes tokens. Protostones are encoded into OP_RETURN outputs, which are then processed by the protorunes compatible indexers. Specifically, protostones are stored in a Protocol field (tag 16383) within a Runestone. This is done in a way that is compatible with the runes metaprotocol and ensures that the runes protocol is not disrupted.

Protostones and protorune data are indexed and executed by Metashrew indexers.


## Metashrew

Metashrew is an open source indexing stack that supports Prototrunes and powers Alkanes smart contracts. It was architected to enable the building of smart contract-based Bitcoin metaprotocols and inherits functionality from the [ordinals](https://docs.ordinals.com/overview.html) protocol. It is able to index [Protorune messages](/docs/developers/protorunes#indexing-protomessages) as well as WASM-based content or smart contracts deployed to an Ordinals' [inscription witness envelope](https://docs.ordinals.com/inscriptions.html). Once interpreted, the content can be transacted against as smart contract programs, using any combination of inputs of value, data, and the context of the transaction itself. 

Metashrew provides comprehensive indexing and execution infrastructure including:

- Block processing and state management with reorg detection
- A key-value store interface for contract state
- Parallel processing of view functions through its RPC layer
- WASM-based execution environment for both contracts and indexers
- Transaction simulation capabilities including fuel costs and state updates

For more details, see [Metashrew](./metashrew.md).
