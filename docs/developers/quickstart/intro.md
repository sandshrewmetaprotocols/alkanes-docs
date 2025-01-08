---
sidebar_position: 1
---

# Tutorial Intro

Alkanes is a token-based smart contract metaprotocol built on the protorunes framework using the protorunes standard. In this section we will modify and deploy a custom smart contract that enables a gated mint for distributing a new Alkanes token. The goal is to demonstrate the smart contract capabilities of Alkanes.

You will use a local Regtest instance to build and test your Alkane contract. 

You will use the Oyl SDK methods to deploy your contract to regtest and to test your contract methods.

Sandshrew-proxy is self-contained docker build comprised of four services:
- sandshrew
  - bitcoind
  - esplora
  - ord
- keydb
- metashrew
- metashrew-view