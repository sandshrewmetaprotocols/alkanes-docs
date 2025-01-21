---
sidebar_position: 2
title: Quickstart Guide
description: Get started with Alkanes development in minutes. Learn how to set up your environment, deploy your first smart contract, and build on Bitcoin with our step-by-step tutorial for developers.
keywords:
  - Alkanes tutorial
  - Bitcoin smart contract tutorial
  - Deploy Bitcoin contracts
  - Alkanes quickstart
  - Bitcoin development guide
  - Protorunes framework
  - Bitcoin regtest
  - Smart contract deployment
image: img/sandshrew.svg
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

If you have not already done so, [set up and run your local Alkanes development environment](setup).

## Deploy a pre-compiled contract

Next you will deploy an example Alkanes "Free Mint" contract to the regtest instance. The Free Mint contract is a simple [factory contract](/docs/learn/alkanes#alkanes-factory-contracts) that allows anyone to deploy and mint Alkanes tokens. We are deploying a factory contract because we only want to deploy the factory contract once, and then clone the factory contract to deploy new alkanes mintable tokens.

A version of the Free Mint contract is included in the [SDK](https://github.com/Oyl-Wallet/oyl-sdk/blob/main/src/alkanes/free_mint.wasm).

### 1. Deploy the Free Mint wasm

To deploy the precompiledFree Mint contract wasm file to the regtest instance, run the following command from the root of the SDK:

```bash
oyl alkane new-contract -c ./src/alkanes/free_mint.wasm -r 7
```

This [CLI command](https://github.com/Oyl-Wallet/oyl-sdk/blob/main/src/cli/alkane.ts) uses default settings (mnemonic, fee rate, network) and reserve number 7 to deploy the contract using the SDK's `new-contract` command. It uses the [commit-reveal pattern](https://docs.ordinals.com/guides/wallet.html?highlight=reveal#creating-inscriptions), familiar to Ordinals developers, to deploy the contract.

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

### 2. Deploy an Alkanes token

Now that you have deployed the Factory contract, you can deploy Alkanes tokens by pointing to the reserve number of the factory contract. To deploy an Alkanes token, run the following command from the root of the SDK:

```bash
oyl alkane new-token -resNumber 7 -amount 1000 -name "MYTOKEN" -symbol "MTK" -cap 100000 -pre 5000
```

This command will deploy a new token with the following parameters:

- **resNumber**: The reserve number of the factory contract
- **amount**: The amount of tokens mintable in one call
- **name**: The name of the token
- **symbol**: The symbol of the token
- **cap**: The supply cap of the token
- **pre**: Amount of tokens to premine to the deployer's address

### 3. Mint a token

Once the token is deployed, you can mint tokens by calling the an `execute` with the mint opcode and [AlkaneId](#alkane-ids) on the token contract. For example, to mint MYTOKEN (MTK) which has an AlkaneId of `[800000, 25]` and a mint opcode of `77`, run the following command on CLI:

```bash
oyl alkane execute -data '800000, 25, 77'
```

This command will mint 1000 (amount set in the new-token command) tokens to the caller's address.

### 4. Send a token

To transfer tokens, you can use the `send` command on the CLI. For example, to send 100 MTK tokens with an AlkaneId of `[800000, 25]` to the address `bc1receiveraddress`, run the following command:

```bash
oyl alkane send -tx 25 -blk 800000 -amt 100 -to bc1receiveraddress
```

## Deploy a custom contract

Next we will deploy a custom "user owned" token contract. This contract will allow users to mint tokens where the entire supply is sent to the user.

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
name = "my-token-contract"
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

```rust
#[derive(Default)]
pub struct MyTokenContract(());

impl MintableToken for MyTokenContract {}

impl AuthenticatedResponder for MyTokenContract {}

impl AlkaneResponder for MyTokenContract {
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

### 6. Add the \_execute function

Now add the `_execute` function to your contract. This function will be called when the contract is executed.

```rust
#[no_mangle]
pub extern "C" fn __execute() -> i32 {
    let mut response = to_arraybuffer_layout(&MyTokenContract::default().run());
    to_ptr(&mut response) + 4
}
```

You should now have a complete contract. The full contract code can be found [here](https://github.com/kungfuflex/alkane-factory/blob/master/alkanes/owned-token/src/lib.rss).

### 7. Compile the contract

You are now ready to compile your contract.

:::info
There are several additional steps enable compiling on macOS. See [this issue](https://github.com/kungfuflex/alkanes-rs/issues/32) for more details.
:::

From the root of the `alkane-factory` repo, run the following command:

```sh
cargo build --target wasm32-unknown-unknown
```

Your wasm will be built to `target/alkanes/wasm32-unknown-unknown/release/my_token_contract.wasm`.

### 8. Deploy to regtest

Copy the was file to the SDK:

```sh
cp target/alkanes/wasm32-unknown-unknown/release/my_token_contract.wasm ../oyl-sdk/src/alkanes/
```

Similar to the free_mint example above, use the SDK CLI to deploy the contract to the regtest instance.

```sh
cd ../oyl-sdk
oyl alkane factory-deploy -c ./src/alkanes/my_token_contract.wasm -r "0x8"
```

This command does a gzip compression level 9 to compress the wasm to a `*.wasm.gz` and then deploys to your Bitcoin regtest.
