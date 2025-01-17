---
sidebar_position: 1
title: Account Management
---

# Understanding Bitcoin Accounts

Bitcoin accounts are the foundation of user interaction with the Bitcoin network. The Account module in the OYL SDK provides a comprehensive system for managing these accounts, enabling developers to work with different address types, handle keys securely, and implement flexible spending strategies.

## What is a Bitcoin Account?

A Bitcoin account in the OYL SDK represents a complete wallet that can interact with the Bitcoin network. It encompasses multiple address types, each serving different use cases and compatibility requirements:

- **Taproot Addresses**: The newest and most advanced address type, supporting enhanced privacy and smart contract capabilities
- **Native SegWit**: Modern addresses offering improved efficiency and lower transaction fees
- **Nested SegWit**: Backwards-compatible SegWit addresses for legacy system support
- **Legacy Addresses**: Traditional Bitcoin addresses for maximum compatibility

Each address type within an account is derived from a single seed phrase (mnemonic), ensuring secure and deterministic wallet generation.

## Core Components

### Account Structure

An account combines multiple address types with spending configuration:

```typescript
type Account = {
  taproot: {
    pubkey: string
    pubKeyXOnly: string
    address: string
    hdPath: string
  }
  nativeSegwit: {
    pubkey: string
    address: string
    hdPath: string
  }
  nestedSegwit: {
    pubkey: string
    address: string
    hdPath: string
  }
  legacy: {
    pubkey: string
    address: string
    hdPath: string
  }
  spendStrategy: SpendStrategy
  network: bitcoin.Network
}
```

### Spending Strategies

Spending strategies define how your account handles transactions and UTXO management:

```typescript
interface SpendStrategy {
  addressOrder: AddressKey[]       // Prioritizes which address types to use
  utxoSortGreatestToLeast: boolean // Controls UTXO selection order
  changeAddress: AddressKey        // Determines where change is sent
}
```

## Working with Accounts

### Creating New Accounts

To create a new Bitcoin account, you'll typically follow these steps:

```typescript
import { generateMnemonic, mnemonicToAccount } from 'oyl-sdk/account'

// Generate a secure mnemonic phrase
const mnemonic = generateMnemonic()

// Create an account with custom settings
const account = mnemonicToAccount({ 
  mnemonic,
  opts: {
    spendStrategy: {
      addressOrder: ['taproot', 'nativeSegwit'], // Prefer modern addresses
      utxoSortGreatestToLeast: true,
      changeAddress: 'taproot'
    }
  }
})
```

### Managing Private Keys

Private keys are the core of account security. The SDK provides secure key management:

```typescript
const privateKeys = getWalletPrivateKeys({
  mnemonic,
  opts: { network: 'mainnet' }
})
```

## Advanced Features

### HD Path Customization

The SDK supports various HD path standards for different wallet configurations:

- **BIP44 Account Last**: Modern derivation path with account index at the end
- **Standard BIP44**: Traditional Bitcoin HD path structure
- **Simple BIP32**: Minimalist derivation path for specific use cases

### Network Support

Accounts can be created for different Bitcoin networks:

- **Mainnet**: For production applications
- **Testnet**: For development and testing
- **Custom Networks**: For specialized use cases

## Best Practices

When working with Bitcoin accounts, follow these key principles:

1. **Security First**: Never store or transmit mnemonics in plaintext
2. **Address Selection**: Use Taproot or Native SegWit for modern applications
3. **Change Management**: Configure change addresses based on your privacy needs
4. **Validation**: Always validate mnemonics before creating accounts
5. **Network Awareness**: Explicitly specify the network in production environments

By following these practices and understanding the account structure, you can build secure and efficient Bitcoin applications using the OYL SDK.