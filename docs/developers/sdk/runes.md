# Runes

The Runes module provides comprehensive functionality for interacting with the Runes protocol on Bitcoin, enabling creation, minting, and transfer of Runes tokens. This module handles all the complex transaction construction and signing required for Runes operations.

## Overview

The Runes module provides:
- Creation of new Runes tokens (etching)
- Minting of existing Runes
- Transfer of Runes between addresses
- UTXO management for Runes operations
- Fee estimation and optimization

## Core Operations

### Etching New Runes

Creating new Runes tokens is a two-step process:

```typescript
// Step 1: Commit transaction
const commitResult = await etchCommit({
  gatheredUtxos,
  runeName: "EXAMPLE",
  account,
  provider,
  feeRate: 2
})

// Step 2: Reveal transaction
const revealResult = await etchReveal({
  symbol: "EX",
  cap: 21000000n,
  premine: 1000000n,
  perMintAmount: 1000n,
  divisibility: 8,
  commitTxId: commitResult.txid,
  script: commitResult.script,
  runeName: "EXAMPLE",
  account,
  provider
})
```

### Minting Runes

```typescript
const mintResult = await mint({
  gatheredUtxos,
  account,
  runeId: "EXAMPLE",
  provider,
  feeRate: 2,
  signer
})
```

### Sending Runes

```typescript
const sendResult = await send({
  gatheredUtxos,
  toAddress: "bc1...",
  amount: 100,
  runeId: "EXAMPLE",
  account,
  provider,
  signer
})
```

## Key Types

### RuneUTXO
Represents a UTXO containing Runes:

```typescript
interface RuneUTXO {
  txId: string
  txIndex: string
  script: string
  address: string
  amountOfRunes: number
  satoshis: number
}
```

### SingleRuneOutpoint
Detailed information about a Rune-containing output:

```typescript
interface SingleRuneOutpoint {
  output: string
  wallet_addr: string
  pkscript: string
  balances: number[]
  decimals: number[]
  rune_ids: string[]
  satoshis?: number
}
```

## Advanced Features

### Fee Estimation

The module provides accurate fee estimation for all Rune operations:

```typescript
const { fee } = await actualSendFee({
  gatheredUtxos,
  account,
  runeId,
  amount,
  provider,
  toAddress
})
```

### UTXO Management

Intelligent UTXO selection and management for Runes operations:

```typescript
const { runeUtxos, runeTotalSatoshis } = await findRuneUtxos({
  address,
  greatestToLeast: true,
  provider,
  runeId,
  targetNumberOfRunes
})
```

## Best Practices

1. **UTXO Management**
   - Always verify UTXO availability before operations
   - Consider UTXO consolidation for efficient operations
   - Avoid using UTXOs with multiple inscriptions

2. **Fee Handling**
   - Use fee estimation functions for accurate fee calculation
   - Consider network congestion when setting fee rates
   - Include sufficient fee buffer for time-sensitive operations

3. **Transaction Safety**
   - Verify all transaction parameters before signing
   - Test operations on testnet first
   - Implement proper error handling for failed transactions

4. **Security Considerations**
   - Protect private keys and signing operations
   - Validate all addresses before sending
   - Implement proper transaction validation

## Usage Example

Here's a complete example of creating and sending Runes:

```typescript
import { Runes } from 'oyl-sdk/runes'

// Initialize provider and account
const provider = new Provider(network)
const account = await mnemonicToAccount({ mnemonic, network })

// Create new Runes
const commit = await etchCommit({
  gatheredUtxos,
  runeName: "EXAMPLE",
  account,
  provider
})

const reveal = await etchReveal({
  symbol: "EX",
  cap: 21000000n,
  commitTxId: commit.txid,
  script: commit.script,
  runeName: "EXAMPLE",
  account,
  provider
})

// Send Runes
const send = await send({
  gatheredUtxos,
  toAddress: recipientAddress,
  amount: 100,
  runeId: "EXAMPLE",
  account,
  provider,
  signer
})
```

## Error Handling

The module uses the `OylTransactionError` class for error handling:

```typescript
try {
  await send({ ... })
} catch (error) {
  if (error instanceof OylTransactionError) {
    console.error('Transaction failed:', error.message)
  }
}
``` 