---
sidebar_position: 6
title: Alkanes Token Standard
---

# Alkanes Token Standard

## Introduction

The Alkanes Token Standard provides a consistent interface for fungible tokens on Bitcoin. Similar to how ERC-20 standardized tokens on Ethereum, this standard ensures Alkanes tokens can be easily integrated with wallets, exchanges, and other decentralized applications.

## Required Opcodes

Every Alkanes token contract must implement these core opcodes:

```rust
// Basic token information
0: initialize()                         // Initializes the token parameters during deployment
99: name() -> String                    // Returns the token's name
100: symbol() -> String                 // Returns the token's symbol
101: total_supply() -> u128             // Returns the total token supply
999: data()                             // Returns all data for an alkane

// Optional data
1000: metadata() -> Vec<u8>              // Returns token metadata (e.g. image)
```

## Optional Opcodes

These opcodes provide additional functionality but are not required:

```rust
// Minting (if supported)
77: mint()                             // Mints or transfers tokens
102: cap() -> u128                     // Returns maximum maxiumum number of mints allowed
103: minted() -> u128                  // Returns total mints
104: value_per_mint() -> u128          // Returns the value per mint
```

## Example Implementation

Here's an example of a minimal compliant implementation:

```rust
impl AlkaneResponder for TokenContract {
    fn execute(&self) -> Result<CallResponse> {
        let context = self.context().unwrap();
        let mut inputs = context.inputs.clone();
        let mut response = CallResponse::forward(&context.incoming_alkanes);

        match shift_or_err(&mut inputs)? {
            // Required opcodes
            0 => {
                let token_units = shift_or_err(&mut inputs)?;
                self.set_value_per_mint(shift_or_err(&mut inputs)?);
                self.set_cap(shift_or_err(&mut inputs)?);
                self.set_data()?;
                self.set_name_and_symbol(shift_or_err(&mut inputs)?, shift_or_err(&mut inputs)?);
                response.alkanes.0.push(self.mint(&context, token_units)?);
                Ok(response)
            }
            77 => {
                response.alkanes.0.push(self.mint(&context, self.value_per_mint())?);
                self.increment_mint()?;
                if self.minted() > self.cap() {
                    Err(anyhow!("supply has reached cap"))
                } else {
                    Ok(response)
                }
            }
            99 => {
                response.data = self.name().as_bytes().to_vec();
                Ok(response)
            },
            100 => {
                response.data = self.symbol().as_bytes().to_vec();
                Ok(response)
            },
            101 => {
                response.data = self.total_supply().to_le_bytes().to_vec();
                Ok(response)
            },
            1000 => {
                response.data = self.metadata().to_vec();
                Ok(response)
            },
            _ => Err(anyhow!("unrecognized opcode"))
        }
    }
}
```

## Storage Requirements

Token contracts must maintain these minimum storage values:

```rust
// Required storage keys
/name            // Token name as string
/symbol          // Token symbol as string
/totalsupply     // Total supply as u128
```

These optional storage keys provide additional functionality:

```rust
/cap             // Maximum number of mints allowed as u128
/minted          // Total mints as u128
/value-per-mint  // Value per mint as u128
```

## Best Practices

1. **Validation**

   - Always validate input parameters
   - Check for sufficient balances before transfers
   - Verify authorization for protected operations

2. **State Management**

   - Use atomic operations for balance updates
   - Maintain accurate total supply tracking
   - Handle edge cases (e.g. overflow)

3. **Error Handling**
   - Return clear error messages
   - Handle all edge cases gracefully
   - Maintain consistent error codes

## Events

While Bitcoin doesn't have native events like Ethereum, important state changes should be detectable through transaction analysis:

- Token transfers
- Supply changes (mint/burn)
- Ownership changes
- Authorization updates

## Testing Requirements

Token implementations should verify:

1. Basic functionality (transfers, balances)
2. Edge cases (zero transfers, max values)
3. Access control
4. State consistency
5. Error conditions
