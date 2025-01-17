# Signer

The Signer module is the cryptographic powerhouse of the OYL SDK, handling all transaction signing operations across different Bitcoin address types. This module is critical for secure transaction handling and requires careful management of private keys.

## Overview

The Signer module provides:
- Comprehensive PSBT (Partially Signed Bitcoin Transaction) handling
- Support for all major Bitcoin address types
- Message signing capabilities with multiple protocols
- Flexible signature hash type options
- Individual and batch input signing

## Core Types

### walletInit
Configuration for initializing the signer with private keys:

```typescript
type walletInit = {
  segwitPrivateKey?: string
  taprootPrivateKey?: string
  legacyPrivateKey?: string
  nestedSegwitPrivateKey?: string
}
```

### SighashType
Supported Bitcoin signature hash types:

```typescript
enum SighashType {
  ALL                 // Sign all inputs and outputs
  NONE               // Sign only inputs
  SINGLE             // Sign inputs and corresponding output
  ANYONECANPAY       // Allow additional inputs
  ALL_ANYONECANPAY
  NONE_ANYONECANPAY
  SINGLE_ANYONECANPAY
}
```

## Class: Signer 🔐

### Constructor
```typescript
constructor(network: bitcoin.Network, keys: walletInit)
```
Creates a new signer instance with the specified network and private keys.

### Key Methods

#### signAllInputs()
```typescript
async signAllInputs({
  rawPsbt?: string,
  rawPsbtHex?: string,
  finalize?: boolean
}): Promise<{ signedPsbt: string, signedHexPsbt: string }>
```
The Swiss Army knife of transaction signing - automatically detects and signs all inputs that match the provided private keys.

#### signTaprootInput()
```typescript
async signTaprootInput({
  rawPsbt: string,
  inputNumber: number,
  finalize: boolean
}): Promise<{ signedPsbt: string }>
```
Signs a specific Taproot input in a PSBT.

#### signSegwitInput()
```typescript
async signSegwitInput({
  rawPsbt: string,
  inputNumber: number,
  finalize: boolean
}): Promise<{ signedPsbt: string }>
```
Signs a specific SegWit input in a PSBT.

#### signMessage()
```typescript
async signMessage({
  message: string,
  address?: string,
  keypair: ECPairInterface,
  protocol: 'ecdsa' | 'bip322'
}): Promise<string>
```
Signs arbitrary messages using either ECDSA or BIP-322 protocols.

## Usage Example

```typescript
import { Signer } from 'oyl-sdk/signer'
import { networks } from 'bitcoinjs-lib'

// Initialize signer with private keys
const signer = new Signer(networks.bitcoin, {
  taprootPrivateKey: "your_taproot_private_key",
  segwitPrivateKey: "your_segwit_private_key"
})

// Sign a PSBT
const result = await signer.signAllInputs({
  rawPsbt: "your_base64_psbt",
  finalize: true
})

console.log(result.signedPsbt) // Your signed transaction
```

## Security Considerations

1. **Private Key Security**: Never expose private keys in logs, storage, or code
2. **Key Isolation**: Use separate key instances for different operations
3. **Validation**: Always validate PSBTs before signing
4. **Network Verification**: Ensure correct network configuration to prevent mainnet/testnet confusion
5. **Finalization**: Consider implications of automatic finalization

## Advanced Features

### Batch Operations
- `signAllTaprootInputs()`: Sign all Taproot inputs in one operation
- `signAllSegwitInputs()`: Sign all SegWit inputs in one operation

### Multiple Input Types
The signer can handle mixed transactions with different input types:
- Taproot (P2TR)
- Native SegWit (P2WPKH)
- Nested SegWit (P2SH-P2WPKH)
- Legacy (P2PKH)

### Message Signing Protocols
- ECDSA: Traditional Bitcoin message signing
- BIP-322: Modern Bitcoin message signing standard

## Best Practices

1. Always verify the transaction details before signing
2. Use appropriate error handling for signing operations
3. Implement proper key management and storage
4. Consider using `signAllInputs()` for automatic input type detection
5. Verify network configuration before signing mainnet transactions