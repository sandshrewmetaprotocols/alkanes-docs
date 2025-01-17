# Ordinals

The Ordinals module provides functionality for managing and transferring Ordinal inscriptions on Bitcoin. This module handles the complexities of working with Ordinal inscriptions, ensuring safe transfers while maintaining inscription integrity.

## Overview

The Ordinals module provides:
- Transfer of Ordinal inscriptions between addresses
- UTXO management for inscriptions
- Fee estimation for transfers
- Inscription validation and verification

## Core Operations

### Transferring Inscriptions

Transfer an Ordinal inscription to a new address:

```typescript
const sendResult = await send({
  gatheredUtxos,
  toAddress: "bc1p...",
  inscriptionId: "abcdef123...",
  feeRate: 2,
  account,
  provider,
  signer
})

console.log("Transfer complete:", sendResult.txId)
```

### Fee Estimation

Calculate accurate fees for inscription transfers:

```typescript
const { fee } = await actualFee({
  gatheredUtxos,
  account,
  inscriptionId: "abcdef123...",
  toAddress: "bc1...",
  feeRate: 2,
  provider,
  signer
})
```

### Finding Inscriptions

Locate and validate inscription ownership:

```typescript
const inscriptionData = await findCollectible({
  address: "bc1...",
  provider,
  inscriptionId: "abcdef123..."
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
    // Handle specific error cases
  }
}
```

## Safety Features

The module includes several safety checks:
- Validates inscription ownership before transfers
- Prevents transfers of UTXOs with multiple inscriptions
- Verifies inscription availability (not already spent)
- Ensures sufficient balance for transfer fees

## Best Practices

When working with Ordinal inscriptions:
1. Always verify inscription ownership before transfer
2. Use appropriate fee rates based on network conditions
3. Handle UTXOs with multiple inscriptions separately
4. Monitor transaction confirmation for transfer completion 