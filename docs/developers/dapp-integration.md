---
sidebar_position: 4
---

# Integrating Alkanes

Overview of alkanes repo, sdk, and a sample dapp

## Wallet Connection with Laser Eyes

[Laser Eyes](https://lasereyes.build) is a comprehensive Bitcoin wallet connector that enables signing Partially Signed Bitcoin Transactions (PSBTs) using popular third-party wallets. It simplifies dapp development by providing a unified interface for wallet interactions, making it easy to request transaction signatures from users' preferred Bitcoin wallets. It addresses common challenges in Bitcoin application development by offering:

- **Multi-wallet Support**: Seamless integration with popular Bitcoin wallets (OYL, Unisat, Xverse, Leather)
- **PSBT Signing**: Simple API for requesting PSBT signatures from connected wallets
- **React Integration**: Simple setup with `LaserEyesProvider` and `useLaserEyes` hook
- **TypeScript Support**: Strong typing for enhanced developer productivity
- **Comprehensive Features**: Balance checking, transaction signing, message signing, and network switching

### Quick Integration Example

To integrate Laser Eyes into your React application:

1. Install the package:
   ```bash
   npm install @laser-eyes/react
   ```

2. Wrap your app with the provider and use the hook in your components:
   ```typescript
   import { LaserEyesProvider, useLaserEyes } from '@laser-eyes/react';

   // Wrap your app with the provider
   function App() {
     return (
       <LaserEyesProvider>
         <YourApp />
       </LaserEyesProvider>
     );
   }

   // Use the hook in your components
   function WalletConnect() {
     const { connect, address, balance } = useLaserEyes();
     // ... rest of your component
   }
   ```

For detailed documentation and advanced features, visit [lasereyes.build](https://www.lasereyes.build/docs/getting-started).
