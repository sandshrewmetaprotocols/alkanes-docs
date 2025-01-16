---
sidebar_position: 4
title: Building Contracts
---

# Building Alkane Contracts

This guide will walk you through how to build ALKANE contracts, explaining the core concepts and components you'll need to implement.

## Contract Structure

An ALKANE contract consists of these main components:

1. A struct implementing the `AlkaneResponder` trait
2. Storage management for contract state
3. Opcode handlers for different contract actions
4. The required `__execute` export function

### Basic Contract Template

Here's a minimal template for an ALKANE contract:

```rust
use alkanes_runtime::runtime::AlkaneResponder;
use alkanes_support::response::CallResponse;
use metashrew_support::compat::{to_arraybuffer_layout, to_ptr};

#[derive(Default)]
pub struct MyContract(());

impl AlkaneResponder for MyContract {
    fn execute(&self) -> Result<CallResponse> {
        let context = self.context().unwrap();
        let mut inputs = context.inputs.clone();
        let mut response = CallResponse::forward(&context.incoming_alkanes);

        // Your opcode handling logic here

        Ok(response)
    }
}

#[no_mangle]
pub extern "C" fn __execute() -> i32 {
    let mut response = to_arraybuffer_layout(&MyContract::default().run());
    to_ptr(&mut response) + 4
}
```

## Storage Management

ALKANE contracts use a key-value storage system to maintain state. Here's how to implement storage:

```rust
// Define storage pointers
impl MyContract {
    pub fn some_value_pointer(&self) -> StoragePointer {
        StoragePointer::from_keyword("/some-value")
    }

    // Getter
    pub fn some_value(&self) -> u128 {
        self.some_value_pointer().get_value::<u128>()
    }

    // Setter
    pub fn set_some_value(&self, v: u128) {
        self.some_value_pointer().set_value::<u128>(v);
    }
}
```

## Handling Opcodes

Opcodes are numbers that determine which action the contract should take. Here's how to implement opcode handling:

```rust
impl AlkaneResponder for MyContract {
    fn execute(&self) -> Result<CallResponse> {
        let context = self.context().unwrap();
        let mut inputs = context.inputs.clone();
        let mut response = CallResponse::forward(&context.incoming_alkanes);

        match shift_or_err(&mut inputs)? {
            // Initialization opcode
            0 => {
                // Handle contract initialization
                let initial_value = shift_or_err(&mut inputs)?;
                self.set_some_value(initial_value);
                Ok(response)
            },

            // Custom action opcode
            1 => {
                // Handle some custom action
                let param = shift_or_err(&mut inputs)?;
                // Process the action...
                Ok(response)
            },

            // Query opcode
            2 => {
                // Return some stored value
                response.data = self.some_value().to_le_bytes().to_vec();
                Ok(response)
            },

            _ => Err(anyhow!("unrecognized opcode"))
        }
    }
}
```

## Common Opcode Patterns

Here are some common opcode patterns you might implement:

- **0**: Initialization/deployment
- **1-50**: Core functionality (transfers, mints, etc.)
- **51-100**: Administrative actions
- **101-200**: Query functions (view functions)
- **1000+**: Custom functionality

## Example: Free Mint Contract

Here's a practical example of how these components work together in a contract that allows users to mint tokens:

```rust
impl MintableAlkane {
    // Storage pointers
    pub fn minted_pointer(&self) -> StoragePointer {
        StoragePointer::from_keyword("/minted")
    }

    pub fn cap_pointer(&self) -> StoragePointer {
        StoragePointer::from_keyword("/cap")
    }

    // Storage getters/setters
    pub fn minted(&self) -> u128 {
        self.minted_pointer().get_value::<u128>()
    }

    pub fn set_cap(&self, v: u128) {
        self.cap_pointer()
            .set_value::<u128>(if v == 0 { u128::MAX } else { v })
    }
}

impl AlkaneResponder for MintableAlkane {
    fn execute(&self) -> Result<CallResponse> {
        let context = self.context().unwrap();
        let mut inputs = context.inputs.clone();
        let mut response = CallResponse::forward(&context.incoming_alkanes);

        match shift_or_err(&mut inputs)? {
            // Initialize contract
            0 => {
                let token_units = shift_or_err(&mut inputs)?;
                self.set_value_per_mint(shift_or_err(&mut inputs)?);
                self.set_cap(shift_or_err(&mut inputs)?);
                Ok(response)
            },

            // Mint tokens
            77 => {
                response.alkanes.0.push(
                    self.mint(&context, self.value_per_mint())?
                );
                self.increment_mint()?;

                if self.minted() > self.cap() {
                    Err(anyhow!("supply has reached cap"))
                } else {
                    Ok(response)
                }
            },

            // Query total minted
            103 => {
                response.data = self.minted().to_le_bytes().to_vec();
                Ok(response)
            },

            _ => Err(anyhow!("unrecognized opcode"))
        }
    }
}
```

## Response Handling

The `CallResponse` object is how your contract communicates back to the caller. It can:

1. Return data via the `data` field
2. Transfer Alkanes via the `alkanes` field
3. Forward received Alkanes using `CallResponse::forward()`

## Best Practices

1. Always validate inputs and handle errors appropriately
2. Use clear opcode numbers and document their purpose
3. Implement query functions to allow reading contract state
4. Use meaningful storage key names
5. Keep related storage functions grouped together
6. Include proper error handling for all operations

## Testing

It's recommended to test your contract thoroughly before deployment. You can use the [ALKANE Regtest framework](setup) to:

- Test individual opcode handlers
- Verify storage operations
- Simulate transactions
- Check error conditions

Remember to test both successful and failure scenarios for each operation your contract supports.
