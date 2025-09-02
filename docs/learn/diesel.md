---
id: diesel
title: What is $DIESEL?
sidebar_label: What is $DIESEL?
sidebar_position: 7
description: Understanding DIESEL - The First ALKANE Token
---

<div style={{
  aspectRatio: '16/9',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid var(--ifm-color-emphasis-200)',
  width: '100%',
  height: '100%',
  position: 'relative',
  marginTop: '20px',
}}>
  <video
    autoPlay
    loop
    playsInline
    muted
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }}
  >
    <source src="/img/hexagon2.mp4" type="video/mp4" />
  </video>
</div>

# What is $DIESEL?

DIESEL is the first example of a Bitcoin Layer-1 (L1) smart contract asset built on the ALKANES protocol—often referred to as the "first Alkanization of crude oil." Its design mirrors the Bitcoin block reward schedule and demonstrates how flexible ALKANES is for creating custom asset distributions on Bitcoin.

## Key Points

### Mirrors Bitcoin Block Rewards

For each new Bitcoin block, a matching DIESEL reward can be claimed by the first valid transaction that calls the DIESEL contract and makes it into that block.

### No Separate Token Fees

ALKANES strictly uses BTC for transaction fees; DIESEL is not required to interact with the protocol.

### 2140 Endpoint

Because DIESEL follows Bitcoin's halving schedule, the last DIESEL will be rewarded around 2140, the same time Bitcoin's own subsidy ends.

### Highlight of ALKANES' Flexibility

By creating an asset like DIESEL, developers showcase how ALKANES can support any type of distribution—whether halving-based, inflationary, deflationary, or otherwise.

## How to Get DIESEL

### Acquiring from Existing Holders

Once DIESEL starts circulating, you can obtain it via peer-to-peer trades, AMMs on ALKANES (e.g., Oyl Swap), or other secondary markets.

### Minting DIESEL

DIESEL is minted on a block-by-block basis. See the upgrade details below for how the minting rewards are calculated.

## 🛠️ DIESEL Upgrade

The DIESEL contract was upgraded at block 909,861. This upgrade introduced a new mint distribution formula while keeping the minting call itself the same.

[View Upgrade Transaction on Ordiscan](https://ordiscan.com/tx/11da430c851a6a7627495dce130d37f0ad3d1bd730b29896ae947540215dbcc5)

### Why Was DIESEL Upgraded?

The original DIESEL minting mechanism awarded the entire block's reward to the _first_ valid transaction in each block. While simple, this created an environment where a single party could monopolize the minting process by using sophisticated botting techniques.

In response to community feedback expressing discontent with this monopoly, the contract was upgraded to a more equitable distribution model. The new formula ensures that all participants who successfully mint in a block receive a fair share of the rewards, fostering broader participation and decentralizing the distribution.

### Minting Call (Unchanged)

Minting continues to use the same contract call. There are no changes to the calldata or execution logic for initiating a mint.

```bash
oyl alkanes execute --calldata "2,0,77"
```

### New Mint Distribution Formula

With the upgrade live, the amount of DIESEL each minter receives follows a new formula:

**Your Mint Amount** = **Total DIESEL Allocated to Minters** / **Number of Mints in Block**

Where:

- **Total DIESEL Allocated to Minters** = `BTC Block Reward` - `DIESEL Protocol Allocation`
- **DIESEL Protocol Allocation** = `min(Block Total TX Fees, 0.5 * BTC Block Reward)`

### Minting Constraints

A key rule of the new system is that only **one mint is allowed per transaction**. Attempting to mint multiple times using multiple protostones in a single transaction will be rejected.

### Purpose of the DIESEL Protocol Allocation

The DIESEL Protocol Allocation serves two primary functions:

1.  **Enhance Liquidity:** Redirect value into DIESEL AMM pools.
2.  **Support Sustainability:** Support the long-term health of the ecosystem and prevent minting rewards from being overly diluted.

This allocation is capped at 50% of the BTC block reward, ensuring minters always receive a share of DIESEL for valid mint calls.

### Example Distribution Calculation

Let's walk through an example:

- **BTC Block Reward:** 3.125 BTC
- **Block TX Fees:** 0.125 BTC
- **Number of Mints:** 30

**Step 1: Calculate DIESEL Protocol Allocation**
The protocol allocation is the smaller of the total transaction fees or half the block reward.
`min(0.125, 0.5 * 3.125)` = `min(0.125, 1.5625)` = **0.125**

**Step 2: Calculate Total DIESEL Allocated to Minters**
This is the block reward minus the protocol's allocation.
`3.125 - 0.125` = **3.000 DIESEL**

**Step 3: Calculate Mint Amount per User**
The total allocated DIESEL is divided equally among all minters in the block.
`3.000 / 30` = **0.1 DIESEL per mint**

For details on the original distribution mechanism, see the [Legacy DIESEL Distribution](./legacy-diesel.md) page.

## Wrapping Up

DIESEL exemplifies how custom smart contract assets on Bitcoin can operate in parallel with BTC's own issuance schedule.

It reinforces Bitcoin's long-term fee market by incentivizing additional on-chain activity—all secured by the Bitcoin network itself.

As the first ALKANE, DIESEL establishes a model for future on-chain tokens with unique distribution rules, no extra protocol fees, and direct alignment with Bitcoin's security.

View the code for the DIESEL Genesis Alkane contract here:

https://github.com/kungfuflex/alkanes-rs/blob/main/crates/alkanes-std-genesis-alkane/src/lib.rs
