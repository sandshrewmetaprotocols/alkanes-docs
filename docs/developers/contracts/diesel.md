---
sidebar_position: 1
title: 'Diesel: Genesis Token'
description: 'Implementation guide for Diesel, the Genesis Token standard on Alkanes'
---

# Diesel: Genesis Token

Diesel is the Genesis Token standard implemented on Alkanes, representing a foundational approach to fungible token creation on Bitcoin. This guide covers the implementation details, features, and best practices for working with Diesel tokens.

## Overview

Diesel tokens leverage Alkanes' native smart contract capabilities to provide a robust, secure, and efficient token standard. Key features include:

- Native Bitcoin L1 integration
- Atomic transfers and swaps
- Built-in supply management
- Standardized interface
- Optimized gas efficiency

## Implementation

### Contract Structure

```rust
#[contract]
pub struct DieselToken {
    total_supply: u64,
    balances: Map<Address, u64>,
    allowances: Map<(Address, Address), u64>,
    name: String,
    symbol: String,
    decimals: u8,
}
```

### Core Functions

#### Initialization

```rust
#[init]
pub fn init(name: String, symbol: String, initial_supply: u64) -> Self {
    let mut token = Self {
        total_supply: initial_supply,
        balances: Map::new(),
        allowances: Map::new(),
        name,
        symbol,
        decimals: 18,
    };
    token.balances.insert(msg::sender(), initial_supply);
    token
}
```

#### Transfer Function

```rust
#[method]
pub fn transfer(&mut self, to: Address, amount: u64) -> bool {
    let from = msg::sender();
    self._transfer(from, to, amount)
}
```

## Integration Guide

### Deploying a Diesel Token

1. Prepare deployment parameters:

```typescript
const deployParams = {
  name: 'MyToken',
  symbol: 'MTK',
  initialSupply: '1000000000000000000000000', // 1 million tokens
};
```

2. Deploy using Alkanes SDK:

```typescript
const diesel = await Alkanes.deployContract('DieselToken', deployParams);
```

### Interacting with Diesel Tokens

```typescript
// Transfer tokens
await diesel.transfer(recipientAddress, amount);

// Check balance
const balance = await diesel.balanceOf(address);
```

## Security Considerations

- Implement proper access controls
- Use safe math operations
- Follow standardized patterns
- Conduct thorough testing
- Consider supply management implications

## Best Practices

1. **Supply Management**

   - Carefully plan initial supply
   - Consider implementing mint/burn mechanics
   - Document supply changes

2. **Integration Testing**

   - Test all core functions
   - Verify state transitions
   - Validate error conditions

3. **Upgrades and Maintenance**
   - Plan for potential upgrades
   - Document maintenance procedures
   - Consider governance mechanisms

## Example Implementation

Here's a complete example of a basic Diesel token implementation:

```rust
#[contract]
pub struct DieselToken {
    total_supply: u64,
    balances: Map<Address, u64>,
    allowances: Map<(Address, Address), u64>,
    name: String,
    symbol: String,
    decimals: u8,
}

#[methods]
impl DieselToken {
    #[init]
    pub fn init(name: String, symbol: String, initial_supply: u64) -> Self {
        let mut token = Self {
            total_supply: initial_supply,
            balances: Map::new(),
            allowances: Map::new(),
            name,
            symbol,
            decimals: 18,
        };
        token.balances.insert(msg::sender(), initial_supply);
        token
    }

    #[method]
    pub fn transfer(&mut self, to: Address, amount: u64) -> bool {
        let from = msg::sender();
        self._transfer(from, to, amount)
    }

    #[method]
    pub fn balance_of(&self, account: Address) -> u64 {
        self.balances.get(&account).unwrap_or(0)
    }

    fn _transfer(&mut self, from: Address, to: Address, amount: u64) -> bool {
        let from_balance = self.balance_of(from);
        require!(from_balance >= amount, "Insufficient balance");

        self.balances.insert(from, from_balance - amount);
        let to_balance = self.balance_of(to);
        self.balances.insert(to, to_balance + amount);

        true
    }
}
```

## Next Steps

1. Review the [complete Diesel specification](link-to-spec)
2. Explore [example implementations](link-to-examples)
3. Join the [developer community](link-to-community)
4. Start building with [Alkanes SDK](link-to-sdk)

## Additional Resources

- [Diesel Technical Documentation](link)
- [Security Considerations](link)
- [Integration Examples](link)
- [Community Forums](link)
