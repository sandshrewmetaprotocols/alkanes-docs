---
id: native-bitcoin-staking
title: 'Native Bitcoin Staking with SUBFROST'
sidebar_label: Native Bitcoin Staking
---

# Native Bitcoin Staking with SUBFROST

**tldr: native Bitcoin restaking protocols are coming**

Over the past several years, a great deal of my research and development effort has been in synthetics, specifically ones backed by Bitcoin. Such assets allow us to utilize native Bitcoin currency within the greater ecosystem of blockchain finance, and are of paramount importance. Generally, projects which aspire to connect Bitcoin to external consensus engines accomplish this using a multisignature custody mechanism, with supplementary incentive mechanisms which, theoretically, create decentralized governance and oversight.

Developing a system like this can be burdensome, but it can be accomplished. More often it is not without some tradeoffs or limited trust assumptions. The final form of such a product should be thought of as an L0, since in spirit it should belong to a consensus engine that allows us to transfer Bitcoin into another representation on a separate L1 or L2.

Projects in the Bitcoin L2 space often feature an L0 subsystem of some kind to facilitate bridging of value on and off an off-chain consensus program.

## BTC on ALKANES

Unlike a scenario where we bridge to other blockchain systems or EVM, if we want to bridge to/from a metaprotocol on the Bitcoin L1 layer, we get the benefit of a shared space for asset representations, which coexist on the same L1 data layer.

On ALKANES, where we have WASM smart contract assets, we can have something like this on Bitcoin L1:

```rust
impl Token for SyntheticBitcoin {
    fn name(&self) -> String {
        String::from("SUBFROST BTC")
    }
    fn symbol(&self) -> String {
        String::from("frBTC")
    }
}
```

Source: [subfrost-alkanes](https://github.com/subfrost/subfrost-alkanes/blob/master/alkanes/fr-btc/src/lib.rs)

This could get good.

In fact, if we are bridging Bitcoin to the ALKANES metaprotocol to a wrapped representation, we can actually design an alkane smart contract for the synthetic, where Bitcoin can be wrapped atomically and without trust assumptions. Since the action of wrapping Bitcoin to an alkane happens as part of a normal protorunes protocol message, it can be composed into other intents which actually use the Bitcoin synthetic and do something with it, all in the same Bitcoin transaction.

Additionally, the alkane for our synthetic can perform all the accounting necessary for a federated multisignature custodian to handle unwrapping back to Bitcoin. Even if we cannot actually unlock Bitcoin spends from the metaprotocol layer, we can use the metaprotocol to signal the signing group to perform this function.

That's a little abstract, but the easy way to put it is that wrapping Bitcoin to an alkane is instant, and unwrapping requires the decentralized multisig. The decentralized multisig reads directly from the alkane to know who burns synthetics and should receive Bitcoin.

SUBFROST is what we call this decentralized custodian and can exist as a very lightweight layer on top of an ALKANES indexer, which simply listens for new blocks and coordinates a small ring of signers which custody and redeem synthetic metaprotocol BTC back to native BTC currency. The ALKANES metaprotocol does all the work for us, so we do not need a heavy-duty consensus engine to coordinate the active group of signers to agree on what messages should be signed over the p2p channel.

Signers just run the ALKANES indexer and SUBFROST software, and thus the consensus model for our L0 exists purely as an extension of the Bitcoin protocol itself.

This is how we can activate Bitcoin in decentralized programs of any kind, to the limit of what we can develop on the WASM execution layer.

## frBTC Usage

The repository for frBTC (SUBFROST BTC) is available at:

https://github.com/subfrost/frBTC

Examples of minting and burning frBTC are available in the test suite, but a web application will be available for ease of access to synthetics.

A frBTC asset challenges the problem surface of building on Bitcoin L1 as we have traditionally seen it:

In a single transaction, it becomes possible to:

- Swap BTC to a Bitcoin native stablecoin asset directly via AMM, at the desired slippage tolerance.
- Deposit BTC into a privacy pool, similar in function to what we see possible on Zcash
- Use BTC as collateral to mint synthetic stablecoins
- Stake BTC (look out for SUBFROST protocol token announcements)

The last item here we will discuss in a future article as we approach SUBFROST on mainnet, but it is something of a long saga of development from myself to make this possible.

All of this, for something which seems so simple in ethos: retain exposure to Bitcoin, but use it to earn more Bitcoin, passively. The difficult part is when we would like to do this with zero (or otherwise minimal) protocol risk.

It is my life's work to see such a protocol come to exist.

## Follow along:

- https://x.com/judoflexchop
- https://x.com/bc1SUBFROST
