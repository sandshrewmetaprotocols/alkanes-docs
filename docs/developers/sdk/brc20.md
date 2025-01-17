# BRC-20 Tokens

The BRC-20 module provides comprehensive functionality for interacting with BRC-20 tokens on Bitcoin, enabling transfers and management of these fungible tokens. This module handles the complex inscription and transaction construction required for BRC-20 operations.

## Overview

The BRC-20 module provides:
- Transfer of BRC-20 tokens between addresses
- Fee estimation for BRC-20 operations
- Multi-step transaction handling
- UTXO management for token operations

## Core Operations

### Transferring BRC-20 Tokens

Transferring BRC-20 tokens is a three-step process that involves creating a transfer inscription and then sending it:

```typescript
const sendResult = await send({
  gatheredUtxos,
  toAddress: "bc1...",
  ticker: "ORDI",
  amount: 100,
  feeRate: 2,
  account,
  provider,
  signer
})

// Returns transaction IDs for all steps
console.log(sendResult.sendBrc20Txids) // [commitTxId, revealTxId, transferTxId]
```

### Fee Estimation

Accurate fee estimation for transfer operations:

```typescript
const estimate = await transferEstimate({
  gatheredUtxos,
  toAddress,
  feeRate: 2,
  account,
  provider
})

console.log(estimate.fee) // Estimated fee in satoshis
```

## Transaction Steps

### 1. Commit Transaction

Creates the initial transaction that will hold the transfer inscription:

```typescript
const commitResult = await commit({
  gatheredUtxos,
  ticker: "ORDI",
  amount: 100,
  feeRate: 2,
  tweakedTaprootPublicKey,
  account,
  provider
})
```

### 2. Reveal Transaction

Reveals the inscription content:

```typescript
const revealResult = await reveal({
  receiverAddress,
  script,
  feeRate: 2,
  tweakedTaprootKeyPair,
  provider,
  commitTxId
})
```

### 3. Transfer Transaction

Completes the token transfer:

```typescript
const transferResult = await transfer({
  commitChangeUtxoId,
  revealTxId,
  toAddress,
  feeRate: 2,
  account,
  provider
})
```

## Best Practices

1. **Transaction Handling**
   - Always handle all three steps (commit, reveal, transfer)
   - Monitor transaction confirmations between steps
   - Implement proper error handling for failed transactions

2. **Fee Management**
   - Use fee estimation before initiating transfers
   - Account for network congestion in fee calculations
   - Consider fee bumping for stuck transactions

3. **UTXO Management**
   - Verify UTXO availability before operations
   - Handle UTXO selection carefully
   - Avoid using UTXOs with existing inscriptions

4. **Security Considerations**
   - Validate all addresses and amounts
   - Implement proper transaction signing
   - Test operations on testnet first

## Complete Usage Example

Here's a full example of transferring BRC-20 tokens:

```typescript
import { BRC20 } from 'oyl-sdk/brc20'

// Initialize provider and account
const provider = new Provider(network)
const account = await mnemonicToAccount({ mnemonic, network })

// Gather UTXOs for the operation
const gatheredUtxos = await accountUtxos({
  account,
  provider
})

// Estimate fees
const estimate = await transferEstimate({
  gatheredUtxos,
  toAddress,
  feeRate: 2,
  account,
  provider
})

// Execute the transfer
const result = await send({
  gatheredUtxos,
  toAddress,
  ticker: "ORDI",
  amount: 100,
  feeRate: 2,
  account,
  provider,
  signer
})

// Handle the result
console.log("Transfer complete:", result.sendBrc20Txids)
```

## Error Handling

The module uses the `OylTransactionError` class for error handling:

```typescript
try {
  await send({ ... })
} catch (error) {
  if (error instanceof OylTransactionError) {
    console.error('Transaction failed:', error.message)
    // Handle specific error cases
  }
}
```

## Transaction Monitoring

Monitor transaction progress between steps:

```typescript
await waitForTransaction({
  txId: revealTxId,
  sandshrewBtcClient: provider.sandshrew
})
```

This ensures proper sequencing of the multi-step transfer process and helps prevent transaction failures. 