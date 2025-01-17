---
sidebar_position: 2
title: ProtoRunes Protocol
description: Deep dive into ProtoRunes - the foundational protocol layer for Alkanes that enables native Bitcoin token functionality. Learn about token creation, management, and the technical specifications of this revolutionary Bitcoin L1 protocol.
keywords:
  - ProtoRunes protocol
  - Bitcoin tokens
  - Bitcoin L1 tokens
  - OP_RETURN tokens
  - Bitcoin token standard
  - Alkanes tokens
  - Bitcoin fungible tokens
  - UTXO tokens
image: img/sandshrew.svg
---

# Protorunes

ProtoRunes is a foundational protocol layer in Alkanes that enables fungible token functionality on Bitcoin L1. It provides a simple yet powerful way to create and manage tokens directly on the Bitcoin blockchain.

## Overview of Specification

ProtoRunes uses OP_RETURN outputs to encode token operations, making it compatible with any Bitcoin implementation that supports standard transactions. The protocol is designed to be minimal while providing essential functionality for fungible tokens.

### Key Features

- **Simple Encoding**: Uses OP_RETURN outputs with a maximum size of 80 bytes
- **Protocol Prefix**: Unique identifier helps identify ProtoRunes transactions during chain scanning
- **Efficient Parsing**: Minimal transaction overhead and easy validation
- **Bitcoin Native**: No special transaction types required
- **State Compatibility**: Works seamlessly with Bitcoin's UTXO model

### Message Types

ProtoRunes supports two primary message types:

1. **Deploy Token**

   ```
   OP_RETURN <PROTORUNES_PREFIX> <DEPLOY> <symbol> <supply>
   ```

   - Creates a new token with specified symbol and supply
   - Token ID is derived from the deployment transaction

2. **Transfer Token**
   ```
   OP_RETURN <PROTORUNES_PREFIX> <TRANSFER> <id> <amount>
   ```
   - Moves tokens between addresses
   - References token ID and specifies amount

## Constructing a ProtoRune

### Using the RPC Interface

The Alkanes RPC interface provides methods for interacting with ProtoRunes:

```typescript
// Query protorunes balance for an address
const balance = await alkanes.protorunesbyaddress({
  address: 'bc1...',
  protocolTag: 1n, // Alkanes protocol identifier
});

// Query protorunes at specific block height
const state = await alkanes.protorunesbyheight({
  height: 800000,
  protocolTag: 1n,
});

// Query specific UTXO
const utxo = await alkanes.protorunesbyoutpoint({
  txid: '1234...',
  vout: 0,
  protocolTag: 1n,
});
```

### State Management

ProtoRunes maintains minimal state information:

- Token metadata (symbol, total supply)
- Address balances
- Transaction history

This state is tracked by Metashrew indexers and can be queried through the RPC interface.

## Integration with Alkanes

ProtoRunes serves as the foundation for Alkanes' token functionality:

1. **Contract Interaction**

   - Smart contracts can create and manage ProtoRunes tokens
   - Tokens can be used in complex DeFi operations

2. **Asset Management**

   - Track token balances across addresses
   - Monitor token transfers and state changes
   - Query historical token states

3. **Transaction Simulation**
   - Preview token operations before execution
   - Validate token transfers and state changes
   - Calculate transaction costs and effects

## Best Practices

When working with ProtoRunes:

1. **State Validation**

   - Always verify token balances before transfers
   - Check for sufficient funds in source addresses
   - Validate token IDs and amounts

2. **Error Handling**

   - Handle RPC errors gracefully
   - Implement proper transaction retry logic
   - Monitor for chain reorganizations

3. **Performance Optimization**
   - Batch related token operations when possible
   - Cache frequently accessed token data
   - Use appropriate block confirmation thresholds

## Example Implementation

Here's a basic example of creating and transferring tokens using ProtoRunes:

```typescript
// Initialize Alkanes RPC client
const alkanes = new AlkanesRpc('http://your-node-url');

// Deploy a new token
const deployTx = await createProtoRunesDeployTx({
  symbol: 'TEST',
  supply: 1000000n,
});

// Transfer tokens
const transferTx = await createProtoRunesTransferTx({
  tokenId: '0x...',
  amount: 1000n,
  recipient: 'bc1...',
});

// Simulate transaction
const simulation = await alkanes.simulate({
  alkanes: [transferTx],
  // ... other simulation parameters
});
```

## Next Steps

- Learn about [Contract Interaction](./contracts-interaction.md)
- Explore [DApp Integration](./dapp-integration.md)
- Study the [RPC Interface](./rpc.md)
