---
sidebar_position: 2
title: FAQ
---

# FAQ

### What is Alkanes?

Alkanes is a smart contract platform built on Bitcoin's L1 (base layer). It allows developers to write and deploy smart contracts using Rust, which are then compiled to WebAssembly (WASM) and executed on Bitcoin. It combines the security of Bitcoin with the programmability typically associated with platforms like Ethereum.

### How is Alkanes different from other Bitcoin smart contract solutions?

While other solutions focus on simple token functionality, Alkanes provides full smart contract capabilities on Bitcoin. It uses WebAssembly for execution, enabling complex applications while maintaining Bitcoin's security model. Unlike alternatives, Alkanes supports contract-to-contract interactions and rich state management.

### What can I build with Alkanes?

You can build any type of smart contract application on Bitcoin, including DeFi protocols, token systems, decentralized applications, and complex financial instruments. If you can build it on Ethereum, you can likely build it on Alkanes.

### Is Alkanes secure and trustless?

Yes. All contract execution happens directly on Bitcoin's L1, inheriting Bitcoin's security model. The protocol is fully verifiable and doesn't require trust in any third party. Contract state and execution are validated by the Bitcoin network.

### What programming language do I use with Alkanes?

Alkanes smart contracts are written in Rust and compiled to WebAssembly. This provides strong safety guarantees and high performance, while leveraging Rust's rich ecosystem of tools and libraries.

### How do Alkanes contracts get deployed?

Contracts are written in Rust, compiled to WebAssembly, and deployed through Bitcoin transactions. The deployment process uses witness reveal payloads (similar to ordinals inscriptions) to store the contract code on-chain.

### How do I interact with Alkanes contracts?

You interact with contracts through Bitcoin transactions using OP_RETURN outputs. The platform provides developer tools, SDKs, and web interfaces to make interaction straightforward for both developers and users.

### What is Metashrew and why is it important?

Metashrew is the indexing system that powers Alkanes. It processes Bitcoin blocks, manages contract state, and enables parallel execution of contracts. Think of it as the equivalent of Ethereum's EVM but built for Bitcoin.

### How does state management work?

Contract state is managed through Bitcoin's UTXO model. Each state transition is recorded on-chain, making it fully verifiable. The system handles complex operations like atomic state updates and automatic reorganization handling.

### What are the gas costs like?

Gas costs are determined by Bitcoin transaction fees and computation complexity. While complex operations may cost more, the system is optimized for efficiency. Exact costs depend on network conditions and contract complexity.

### Can Alkanes contracts interact with each other?

Yes, Alkanes supports full contract-to-contract interactions. Contracts can call methods on other contracts, share state, and compose functionality, similar to how smart contracts work on Ethereum.

### What are the limitations?

Contracts must work within Bitcoin's block size and script limits. While Alkanes is powerful, very computation-heavy operations might be more expensive than on dedicated smart contract platforms. Contract size is also limited by practical deployment constraints.

### How do I get started with development?

Start by setting up a Rust development environment and reviewing the quickstart guide in our documentation. We provide example contracts, templates, and development tools to help you begin building.

### Is Alkanes compatible with existing Bitcoin infrastructure?

Yes, Alkanes is fully compatible with Bitcoin's base layer and existing infrastructure. It works alongside other Bitcoin protocols like Ordinals and Runes, and can be integrated with existing Bitcoin wallets and services.

### Where can I learn more and get help?

Our documentation provides comprehensive guides and references. Join our community channels to connect with other developers, ask questions, and share your projects. We also maintain a growing collection of example contracts and tutorials.
