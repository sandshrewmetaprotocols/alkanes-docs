# UTXOs

The UTXO module is the guardian of Bitcoin's unspent transaction outputs, with special emphasis on protecting and managing metaprotocol artifacts like Ordinals and Runes. This module ensures safe UTXO handling while preserving valuable inscriptions and token data.

## Overview

The UTXO module provides:
- Smart UTXO categorization (spendable, Ordinals, Runes)
- Protection of metaprotocol artifacts (546 sat detection)
- Comprehensive balance tracking across address types
- Advanced UTXO selection strategies
- Concurrent UTXO processing with safety measures

## Core Types

### FormattedUtxo
The fundamental UTXO representation with metaprotocol awareness:

```typescript
interface FormattedUtxo {
  txId: string
  outputIndex: number
  satoshis: number          // Important for 546 sat detection
  scriptPk: string
  address: string
  inscriptions: any[]       // Ordinal inscriptions
  confirmations: number
}
```

### AddressUtxoPortfolio
Comprehensive UTXO portfolio with artifact segregation:

```typescript
interface AddressUtxoPortfolio {
  spendableTotalBalance: number
  spendableUtxos: FormattedUtxo[]    // Safe to spend
  runeUtxos: FormattedUtxo[]         // Contains Runes
  ordUtxos: FormattedUtxo[]          // Contains Ordinals
  pendingUtxos: FormattedUtxo[]
  pendingTotalBalance: number
  totalBalance: number
}
```

### AccountUtxoPortfolio
Account-wide UTXO management:

```typescript
interface AccountUtxoPortfolio {
  accountTotalBalance: number
  accountSpendableTotalUtxos: FormattedUtxo[]
  accountSpendableTotalBalance: number
  accountPendingTotalBalance: number
  accounts: Record<AddressKey, AddressUtxoPortfolio>
}
```

## Key Functions

### addressUtxos()
```typescript
async function addressUtxos({
  address: string,
  provider: Provider,
  spendStrategy?: SpendStrategy
}): Promise<AddressUtxoPortfolio>
```
Smart UTXO categorization that automatically:
- Identifies and segregates Ordinal inscriptions
- Detects and protects Rune-bearing UTXOs
- Categorizes spendable vs. protected UTXOs
- Tracks pending transactions

### accountUtxos()
```typescript
async function accountUtxos({
  account: Account,
  provider: Provider
}): Promise<AccountUtxoPortfolio>
```
Comprehensive account-wide UTXO management across all address types.

### selectUtxos()
```typescript
function selectUtxos(
  utxos: FormattedUtxo[],
  spendStrategy: SpendStrategy
): FormattedUtxo[]
```
Strategic UTXO selection with built-in protections for metaprotocol artifacts.

## Usage Example

```typescript
import { addressUtxos, selectUtxos } from 'oyl-sdk/utxo'

// Get UTXOs with automatic artifact detection
const portfolio = await addressUtxos({
  address: "your_bitcoin_address",
  provider: provider,
  spendStrategy: {
    addressOrder: ['taproot', 'nativeSegwit'],
    utxoSortGreatestToLeast: true
  }
})

// Access different UTXO categories
console.log(portfolio.spendableUtxos)  // Safe to spend
console.log(portfolio.ordUtxos)        // Contains Ordinals
console.log(portfolio.runeUtxos)       // Contains Runes

// Select UTXOs for spending while protecting artifacts
const selectedUtxos = selectUtxos(
  portfolio.spendableUtxos,
  spendStrategy
)
```

## Metaprotocol Safety Features

### Artifact Detection
- Automatic detection of 546 sat outputs (common for inscriptions)
- Separation of UTXOs containing Ordinals
- Identification of Rune-bearing UTXOs
- Protection against accidental artifact spending

### Balance Management
- Separate tracking of spendable and artifact-bearing UTXOs
- Clear differentiation between confirmed and pending balances
- Accurate total balance calculation across all UTXO types

### Concurrent Processing
- Safe parallel processing of UTXO queries
- Built-in error handling for network issues
- Configurable concurrency limits

## Best Practices

1. **Artifact Protection**:
   - Always check for 546 sat outputs before spending
   - Use `ordUtxos` and `runeUtxos` arrays to track special UTXOs
   - Implement additional validation for high-value inscriptions

2. **UTXO Selection**:
   - Prefer using `selectUtxos()` with appropriate strategy
   - Consider UTXO consolidation for better management
   - Be mindful of change output creation

3. **Portfolio Management**:
   - Regularly update UTXO portfolio data
   - Monitor pending transactions for confirmation
   - Keep track of both spendable and protected balances

4. **Performance Optimization**:
   - Use concurrent processing for large UTXO sets
   - Implement caching for frequently accessed data
   - Consider batch processing for multiple addresses

5. **Error Handling**:
   - Implement proper error handling for network issues
   - Validate UTXO data before processing
   - Consider retry strategies for failed queries

## Technical Notes

- UTXOs with 546 satoshis are commonly used for metaprotocol artifacts
- The module uses concurrent processing with a default limit of 100 parallel requests
- UTXO sorting can be customized through the SpendStrategy configuration
- The module integrates with both Ordinals and Runes protocols for comprehensive artifact detection