---
sidebar_position: 1
title: 'Diesel: Genesis Token'
description: 'Implementation guide for Diesel, the Genesis Token standard on Alkanes'
---

# Diesel: Genesis Token

The [Genesis Alkane token contract](https://github.com/kungfuflex/alkanes-rs/blob/main/crates/alkanes-std-genesis-alkane/src/lib.rs) implements a "DIESEL" token deployed on Alkanes. The minting of the token is tied to the block reward of the Bitcoin L1 chain. Anyone can broadcast a transaction that calls the DIESEL contract in a given block. If your transaction is included before anyone else's, you claim that block's DIESEL reward.

For more information, see the [What is Diesel?](/docs/learn/diesel) page.

## Contract Structure

The contract includes different block reward, genesis block, average payout, and total supply parameters depending on the chain (fitcoin, dogecoin, fractal, etc.). The bitcoin mainnet parameters are defined in the "mainnet" implementation:

```rust
#[cfg(feature = "mainnet")]
impl ChainConfiguration for GenesisAlkane {
    fn block_reward(&self, n: u64) -> u128 {
        return (50e8 as u128) / (1u128 << ((n as u128) / 210000u128));
    }
    fn genesis_block(&self) -> u64 {
        840000
    }
    fn average_payout_from_genesis(&self) -> u128 {
        312500000
    }
    fn total_supply(&self) -> u128 {
        131250000000000
    }
}
```

## Claiming DIESEL

After Jump Start, DIESEL can be claimed block-by-block in real time as Bitcoin blocks are mined. Anyone can submit a mint transaction. There are no pre-sale and no VC allocations.

Anyone can broadcast a transaction that calls the DIESEL contract in a given block. If your transaction is included before anyone else's, you claim that block's DIESEL reward. The transaction must be a valid [transaction](/docs/developers/contracts-interaction#sending-a-transaction) with a [protostone message](/docs/developers/protorunes#protomessage) referencing the mint [opcode](/docs/developers/contracts-interaction#contract-opcodes) (`77`) for the DIESEL token contract.

Because DIESEL is the genesis token, it is deployed to [2,0]. So, the mint transaction should use the following calldata:

```javascript
const calldata = [BigInt(2), BigInt(0), BigInt(77)];
```

Ths taproot script you need to submit constists of a protostone with this calldata:

```javascript
const script = encodeRunestoneProtostone({
  protostones: [
    envelope.ProtoStone.message({
      protocolTag: 1n,
      edicts: [],
      pointer: 0,
      refundPointer: 0,
      calldata: envelope.encipher(calldata),
    }),
  ],
}).encodedRunestone;
```

You can use the [alkanes library](https://github.com/kungfuflex/alkanes) and the [Alkanes SDK](/docs/developers/sdk/alkanes) to easily create and submit Alkane transactions.

Use the SDK Alkanes [execute](/docs/developers/sdk/alkanes#contract-execution) method to submit a DIESEL mint transaction:

```javascript
const calldata = [BigInt(2), BigInt(0), BigInt(77)];

const result = await execute({
  gatheredUtxos: await user1.gatheredUtxos(),
  feeRate: feeRate,
  calldata,
  account: user1.account,
  signer: user1.signer,
  provider: provider,
});
```
