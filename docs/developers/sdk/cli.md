# Oyl CLI

The Oyl CLI provides a command-line interface for interacting with the Oyl SDK, making it easy to test and develop with various Bitcoin protocols in both mainnet and regtest environments.

## Prerequisites

Please refer to the global README in the root directory before using the CLI.

## CLI Structure

The CLI follows a hierarchical command structure:

```bash
oyl <namespace> <command> [options]
```

### Example Usage:
```bash
# Basic CLI invocation
oyl

# Specify a namespace
oyl utxo

# Execute a specific command
oyl utxo availableBalance

# Command with parameters
oyl utxo availableBalance -m "your mnemonic" -p regtest
```

Use `--help` at any level to see available options:
```bash
oyl --help
oyl utxo --help
oyl utxo availableBalance --help
```

## Available Namespaces

- `account`: Account management and key operations
- `utxo`: UTXO examination and management
- `btc`: Native Bitcoin transactions
- `brc20`: BRC-20 token operations
- `collectible`: Ordinal collectible management
- `rune`: Rune protocol interactions
- `alkane`: Alkanes protocol operations
- `provider`: RPC provider interactions

## Core Commands

### Account Management
```bash
oyl account generate           # Generate new account
oyl account generateMnemonic   # Generate mnemonic phrase
oyl account privateKeys        # Display private keys
```

### UTXO Operations
```bash
oyl utxo availableBalance     # Check available balance
oyl utxo accountUtxos         # List account UTXOs
oyl utxo addressUtxos         # List address UTXOs
```

### Protocol Operations
```bash
oyl btc send                  # Send BTC
oyl collectible send          # Transfer collectibles
oyl brc20 send               # Transfer BRC-20 tokens
oyl brc20 mint               # Mint BRC-20 tokens
oyl rune send                # Transfer Runes
oyl rune mint                # Mint Runes
```

### Provider Interactions
```bash
oyl provider api             # API operations
oyl provider ord            # Ord server operations
```

## Recommended Workflow

1. Generate an account:
   ```bash
   oyl account generateMnemonic
   ```

2. Fund the account with BTC or Ordinals

3. Check balances:
   ```bash
   oyl utxo availableBalance -m "your mnemonic" -p regtest
   ```

4. Perform desired operations:
   ```bash
   oyl btc send -m "your mnemonic" -t "recipient" -a 0.1
   ```

## Wallet Helper

The CLI includes a Wallet helper class for simplified management:

```typescript
const wallet = new Wallet({
  mnemonic: "your mnemonic here",
  networkType: "regtest",  // 'mainnet' | 'regtest' | 'oylnet'
  feeRate: 2
})
```

## Environment Variables

- `NETWORK`: Network to use (mainnet/regtest)
- `RPC_URL`: Custom RPC endpoint
- `API_KEY`: API key for provider services
- `MNEMONIC`: Default wallet mnemonic

## Regtest Environment

The CLI provides commands for managing a local regtest Bitcoin environment, which is essential for development and testing.

### Initializing Regtest

Initialize a new regtest environment with pre-funded addresses:

```bash
oyl regtest init [options]

Options:
  -m, --mnemonic <mnemonic>  Optional mnemonic for account generation
  -a, --address <address>    Optional address to receive initial funds
```

This command:
- Generates 260 initial blocks
- Funds a faucet address with 60 block rewards
- Sends 5 block rewards to your specified address
- Remaining blocks go to a random address

### Managing Blocks

Generate new blocks to confirm pending transactions:

```bash
oyl regtest genBlocks [options]

Options:
  -a, --address <address>    Optional address to receive block rewards
  -c, --count <count>        Number of blocks to generate (default: 1)
```

### Example Workflow

1. Initialize regtest environment:
```bash
oyl regtest init -m "your mnemonic"
```

2. Make transactions using other CLI commands

3. Generate blocks to confirm transactions:
```bash
oyl regtest genBlocks -c 2
```
