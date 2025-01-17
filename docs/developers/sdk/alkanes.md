# Alkanes

The Alkanes module provides functionality for interacting with Alkanes protocol on Bitcoin, enabling smart contract deployment, token creation, and token transfers. This module handles the complex inscription and transaction construction required for Alkanes operations.

## Overview

The Alkanes module provides:
- Smart contract deployment
- Token creation and management
- Token transfers between addresses
- Contract execution capabilities
- Fee estimation for all operations

## Core Operations

### Deploying Smart Contracts

Deploy an Alkanes smart contract:

```typescript
const deployResult = await contractDeployment({
  payload,
  gatheredUtxos,
  account,
  reserveNumber: "1",
  provider,
  feeRate: 2,
  signer
})

console.log("Contract deployed:", deployResult.txId)
```

### Token Operations

Create and transfer tokens:

```typescript
// Deploy a new token
const tokenResult = await tokenDeployment({
  payload,
  gatheredUtxos,
  account,
  calldata,
  provider,
  feeRate: 2,
  signer
})

// Transfer tokens
const sendResult = await send({
  gatheredUtxos,
  toAddress: "bc1...",
  amount: 1000,
  alkaneId: { block: "123", tx: "abc" },
  feeRate: 2,
  account,
  provider,
  signer
})
```

### Contract Execution

Execute contract functions:

```typescript
const executeResult = await execute({
  gatheredUtxos,
  account,
  calldata: [BigInt(1), BigInt(2)],
  provider,
  feeRate: 2,
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
    // Handle specific error cases
  }
}
```

## Safety Features

The module includes several safety checks:
- Validates contract deployments
- Ensures sufficient balance for operations
- Optimizes fee calculations
- Handles multi-step transactions safely

## Best Practices

When working with Alkanes:
1. Always verify contract deployment status
2. Use appropriate fee rates based on network conditions
3. Handle token operations with proper error checking
4. Monitor transaction confirmations for multi-step operations 