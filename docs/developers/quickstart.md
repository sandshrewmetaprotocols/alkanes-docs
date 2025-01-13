---
sidebar_position: 2
title: Quickstart
---

# Quickstart Tutorial

Alkanes is a token-based smart contract metaprotocol built on the protorunes framework using the protorunes standard. In this section we will modify and deploy a custom smart contract for distributing a new Alkanes token. The goal is to demonstrate the smart contract capabilities of Alkanes.

In this tutorial, you will:

1. Set up and run a local Bitcoin Regtest instance
2. Install and use utilities from Oyl SDK to interact with the regtest instance
3. Deploy an example Alkanes contract to the regtest instance
4. Learn how to modify an existing Alkanes contract
5. Deploy your modified contract to Signet and interact with it using the Oyl SDK CLI

## Set up and run Alkanes regtest

If you have not already done so, [set up and run your local Alkanes development environment](./regtest.md). 

## Deploy a pre-compiled contract

Next you will deploy an example Alkanes "Free Mint" contract to the regtest instance. The Free Mint contract is a simple [factory contract](/docs/learn/alkanes#alkanes-factory-contracts) that allows anyone to deploy and mint Alkanes tokens. We are deploying a factory contract because we only want to deploy the factory contract once, and then clone the factory contract to deploy new alkanes mintable tokens.

A version of the Free Mint contract is included in the [SDK](https://github.com/Oyl-Wallet/oyl-sdk/blob/main/src/alkanes/free_mint.wasm). 

### 1. Deploy the Free Mint wasm

To deploy the precompiledFree Mint contract wasm file to the regtest instance, run the following command from the root of the SDK:

```bash
oyl alkane factoryWasmDeploy -c ./src/alkanes/free_mint.wasm -r "0x7" 
```

This [CLI command](https://github.com/Oyl-Wallet/oyl-sdk/blob/main/src/cli/alkane.ts) uses default settings (mnemonic, fee rate, network) and reserve number "0x7" to deploy the contract using the SDK's `factoryWasmDeploy` command. It uses the [commit-reveal pattern](https://docs.ordinals.com/guides/wallet.html?highlight=reveal#creating-inscriptions), familiar to Ordinals developers, to deploy the contract.

The deployment process:
1. **Setup**
   - Creates wallet instance
   - Processes and compresses WASM contract

2. **Commit Phase**
   - Broadcasts commit transaction
   - Generates block and waits for confirmation

3. **Reveal Phase**
   - Broadcasts reveal transaction with factory reserve number
   - Generates block and waits for confirmation

4. **Verification**
   - Verifies deployment and outputs contract trace

### 2. Mint a token

### 3. Send a token


## Deploy a custom contract

Next we will deploy a custom "user owned" tokencontract. This contract will allow users to mint tokens where the entire supply is sent to the user.

If you have not already done so, familiarize yourself with [alkane contract development](./contracts-building).

### 1. Clone the Alkanes example repo

The first step is to clone the `alkane-factory` example repository. 

```bash
git clone https://github.com/kungfuflex/alkane-factory
```

### 2. Create the files and directories

Open `alkane-factory` in your code editor and create several new directories and files:

```
alkanes/my-token-contract/
alkanes/my-token-contract/Cargo.toml
alkanes/my-token-contract/src/
alkanes/my-token-contract/src/lib.rs
```

### 3. Add the rust libraries

In your Cargo.toml file, add the following dependencies. For more information see the [alkanes libraries](./alkanes-libraries) developer guide.

```rust
[package]
name = "owned-token"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[features]
test = []

[dependencies]
alkanes-support = { git = "https:/github.com/kungfuflex/alkanes-rs" }
alkanes-runtime = { git = "https://github.com/kungfuflex/alkanes-rs" }
metashrew-support = { git = "https://github.com/kungfuflex/alkanes-rs" }
protorune-support = { git = "https://github.com/kungfuflex/alkanes-rs" }
alkane-factory-support = { path = "../../crates/alkane-factory-support" }
ordinals = { git = "https://github.com/kungfuflex/alkanes-rs" }
anyhow = "1.0.94"
bitcoin = { version = "0.32.4", features = ["rand"] }
```

### 4. Import the libraries

In your `src/lib.rs` file, import the libraries:

```rust
use alkanes_runtime::auth::AuthenticatedResponder;
use alkanes_runtime::runtime::AlkaneResponder;
#[allow(unused_imports)]
use alkanes_runtime::{
    println,
    stdio::{stdout, Write},
};
use alkanes_support::utils::shift_or_err;
use alkanes_support::{parcel::AlkaneTransfer, response::CallResponse};
use anyhow::{anyhow, Result};
use metashrew_support::compat::{to_arraybuffer_layout, to_ptr};
use alkane_factory_support::factory::MintableToken;
```

### 5. Add the contract code

TODO: break thid out and explain

```rust
#[derive(Default)]
pub struct OwnedToken(());

impl MintableToken for OwnedToken {}

impl AuthenticatedResponder for OwnedToken {}

impl AlkaneResponder for OwnedToken {
    fn execute(&self) -> Result<CallResponse> {
        let context = self.context()?;
        let mut inputs = context.inputs.clone();
        let mut response: CallResponse = CallResponse::forward(&context.incoming_alkanes.clone());
        match shift_or_err(&mut inputs)? {
            0 => {
                self.observe_initialization()?;
                println!("owned token initializing");
                let _ = self.set_data();
                let auth_token_units = shift_or_err(&mut inputs)?;
                let token_units = shift_or_err(&mut inputs)?;
                self.set_name_and_symbol(shift_or_err(&mut inputs)?, shift_or_err(&mut inputs)?);
                response
                    .alkanes
                    .0
                    .push(self.deploy_auth_token(auth_token_units)?);
                response.alkanes.0.push(AlkaneTransfer {
                    id: context.myself.clone(),
                    value: token_units,
                });
                Ok(response)
            }
            77 => {
                self.only_owner()?;
                let token_units = shift_or_err(&mut inputs)?;
                let transfer = self.mint(&context, token_units)?;
                response.alkanes.0.push(transfer);
                Ok(response)
            }
            99 => {
                response.data = self.name().into_bytes().to_vec();
                Ok(response)
            }
            100 => {
                response.data = self.symbol().into_bytes().to_vec();
                Ok(response)
            }
            101 => {
                response.data = self.total_supply().to_le_bytes().to_vec();
                Ok(response)
            }
            1000 => {
                response.data = self.data();
                Ok(response)
            }
            _ => Err(anyhow!("unrecognized opcode")),
        }
    }
}
```


### N. Add the _execute function

Now add the `_execute` function to your contract. This function will be called when the contract is executed.

```rust
#[no_mangle]
pub extern "C" fn __execute() -> i32 {
    let mut response = to_arraybuffer_layout(&OwnedToken::default().run());
    to_ptr(&mut response) + 4
}
```

### N. Compile the contract

### N. Deploy to regtest

TODO

Can refer to the regtest deplpoyment above...