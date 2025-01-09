---
sidebar_position: 4
---

# Metashrew

Metashrew is an open source [indexer stack](https://github.com/sandshrewmetaprotocols/metashrew) for building bitcoin metaprotocols. It significantly simplifies the architecture and implementation of complex metaprotocols on Bitcoin L1, providing a comprehensive foundation for smart contract development.

Metashrew is the core infrastructure that powers [ALKANES smart contracts](./alkanes.md). It provides:

1. **Block Processing & Indexing**: 
   - Processes Bitcoin blocks and maintains indexes of relevant data
   - Supports deterministic indexing through WASM-based indexer programs
   - Ensures integrity through verifiable WASM binary hashes

2. **State Management**: 
   - Uses a key-value store (KeyDB) to maintain smart contract state
   - Handles state rollbacks during chain reorganizations
   - Provides historical state access at any block height

3. **Contract Execution**: 
   - Executes WASM-based smart contracts and indexers
   - Supports contracts written in Rust with Metashrew runtime bindings
   - Provides isolated execution environments for view functions
   - Enables nested WASM execution (WASM programs running within WASM environments)

4. **RPC Interface & View Layer**:
   - Exposes contract view functions through RPC endpoints
   - Enables parallel processing of read operations
   - Supports comprehensive transaction simulation including:
     - Fuel cost computation
     - Balance sheet validation
     - Output prediction
     - Storage update previews
     - Historical state queries

## Architecture Overview

Metashrew consists of several key components:

- **Indexer**: Processes Bitcoin blocks and maintains relevant indexes through WASM-based programs
- **KeyDB**: Stores contract state and execution data
- **View Layer (metashrew-view)**: 
  - Handles read-only contract function calls
  - Provides parallel processing capabilities
  - Ensures side-effect-free execution
- **WASM Runtime**: Executes smart contract code and indexers in a sandboxed environment

## For Developers

As a smart contract developer, you'll primarily interact with Metashrew through:

1. Deploying WASM contracts that define your smart contract logic
2. Using the RPC interface to query contract state and execute view functions
3. Integrating with the key-value store for state management

The platform handles all the complex infrastructure needed for Bitcoin smart contracts, allowing you to focus on writing contract logic and building your dApp.

