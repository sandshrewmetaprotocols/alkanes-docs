# Bitcoin Transactions

The Bitcoin module provides core functionality for creating and sending native Bitcoin transactions. This module handles the fundamentals of UTXO management, fee calculation, and transaction construction.

## Overview

The Bitcoin module provides:
- Basic Bitcoin transaction creation and sending
- Fee calculation and optimization
- UTXO management and selection
- Multi-address type support (Legacy, SegWit, Native SegWit, Taproot)

## Core Operations

### Sending Bitcoin

Send BTC to an address:

```typescript
const sendResult = await send({
  utxos,
  toAddress: "bc1...",
  amount: 100000, // Amount in satoshis
  feeRate: 2,
  account,
  provider,
  signer
})

console.log("Transfer complete:", sendResult.txId)
```

### Fee Estimation

Calculate accurate fees for transactions:

```typescript
const { fee } = await actualFee({
  utxos,
  toAddress: "bc1...",
  amount: 100000,
  feeRate: 2,
  account,
  provider,
  signer
})
```

### Minimum Fee Calculation

Calculate minimum required fee based on input and output counts:

```typescript
const minFee = minimumFee({
  taprootInputCount: 1,
  nonTaprootInputCount: 0,
  outputCount: 2
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
- Validates UTXO availability
- Ensures sufficient balance for transactions
- Optimizes change output creation
- Validates fee rates against network minimums

## Best Practices

When working with Bitcoin transactions:
1. Always verify UTXO availability before sending
2. Use appropriate fee rates based on network conditions
3. Handle change outputs appropriately
4. Monitor transaction confirmation for completion 