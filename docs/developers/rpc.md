---
sidebar_position: 6
title: Alkanes RPC
---

# Alkanes RPC

## Overview

The Alkanes RPC interface provides methods for interacting with the Alkanes protocol on Bitcoin. It enables querying balances, simulating transactions, and managing protorunes/alkanes assets.

## Base URL

All RPC methods are available via HTTP POST requests to your Alkanes node endpoint.

## Common Parameters

- `blockTag`: Optional parameter for historical queries
  - Type: string
  - Default: "latest"
  - Specifies which block state to query

## Methods

### protorunesbyaddress

Query protorunes balances for a specific address.

```typescript
async protorunesbyaddress({
  address: string,
  protocolTag: bigint
}, blockTag?: string): Promise<{
  outpoints: OutPoint[],
  balanceSheet: RuneOutput[]
}>
```

**Parameters:**

- `address`: Bitcoin address to query
- `protocolTag`: Protocol identifier (1n for Alkanes)

**Returns:**

- `outpoints`: Array of UTXOs containing protorunes
- `balanceSheet`: Array of protorune balances

### protorunesbyheight

Query protorunes state at a specific block height.

```typescript
async protorunesbyheight({
  height: number,
  protocolTag: bigint
}, blockTag?: string): Promise<RunesResponse>
```

**Parameters:**

- `height`: Block height to query
- `protocolTag`: Protocol identifier

### protorunesbyoutpoint

Query protorunes at a specific UTXO.

```typescript
async protorunesbyoutpoint({
  txid: string,
  vout: number,
  protocolTag: bigint
}, blockTag?: string): Promise<OutpointResponse>
```

**Parameters:**

- `txid`: Transaction ID
- `vout`: Output index
- `protocolTag`: Protocol identifier

### simulate

Simulate execution of an Alkanes transaction.

```typescript
async simulate({
  alkanes: AlkaneTransfer[],
  transaction: string,
  height: bigint,
  block: string,
  txindex: number,
  target: {
    block: bigint,
    tx: bigint
  },
  inputs: bigint[],
  vout: number,
  pointer: number,
  refundPointer: number
}, blockTag?: string): Promise<SimulateResponse>
```

**Parameters:**

- `alkanes`: Array of Alkane transfers
- `transaction`: Raw transaction hex
- `height`: Block height
- `block`: Block hash
- `txindex`: Transaction index
- `target`: Alkane contract target
- `inputs`: Array of operation inputs
- `vout`: Output index
- `pointer`: Success pointer
- `refundPointer`: Refund pointer

## Error Handling

All methods may throw errors with the following structure:

```typescript
interface RPCError {
  code: number;
  message: string;
  data?: any;
}
```

## Usage Example

```typescript
const alkanes = new AlkanesRpc('http://your-node-url');

// Query protorunes balance
const balance = await alkanes.protorunesbyaddress({
  address: 'bc1...',
  protocolTag: 1n,
});

// Simulate transaction
const simulation = await alkanes.simulate({
  alkanes: [],
  transaction: '',
  height: 1000000n,
  txindex: 0,
  target: {
    block: 2n,
    tx: 0n,
  },
  inputs: [101n],
  pointer: 0,
  refundPointer: 0,
  vout: 0,
});
```
