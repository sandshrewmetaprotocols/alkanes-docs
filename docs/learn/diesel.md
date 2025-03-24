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

### Submit the First tx in a Block to Mint Transaction

- Anyone can broadcast a transaction that calls the DIESEL contract in a given block.
- If your transaction is included before anyone else's, you claim that block's DIESEL reward.
- Initially, this may be more open—over time, miners or other participants might pay closer attention.

### Acquire from Existing Holders

- Once DIESEL starts circulating, you can obtain it via peer-to-peer trades, AMMs on ALKANES (e.g., Oyl Swap), or other secondary markets.
- All standard Bitcoin transaction fees still apply—no extra DIESEL fees.
- Because ALKANES runs purely on Bitcoin, the mint process and transfers all occur on-chain, secured by Bitcoin's consensus.

## DIESEL Distribution Overview

**Total Supply:** 1,562,500 DIESEL

### Block 880,000: Official Launch

DIESEL goes live when block 880,000 is mined. At this point, the ALKANES indexer will start looking for protocol messages—including transactions calling the DIESEL contract.

### Jump Start (Blocks 800,000 → 880,000)

Instead of letting those blocks be minted retroactively, we do a one-time allocation of roughly 28% of the total DIESEL supply (i.e., 440,000 tokens) at block 880,000.

This allocation is earmarked for the OYL protocol team and select community airdrops (specific details & eligibility TBA).

### Remaining ~72%

- Claimed block-by-block in real time as Bitcoin blocks are mined.
- Anyone can submit a mint transaction—no pre-sale, no VC allocations.

### Why the Jump Start?

The jump start covers blocks 800,000 to 880,000, mirroring what Bitcoin's subsidy would have produced in that window. Instead of distributing it block-by-block, we allocate that chunk at once. This grants:

- Driving adoption and Utility for ALKANES development
- Community Engagement through airdrops to early adopters across Bitcoin-based ecosystems.

## Wrapping Up

DIESEL exemplifies how custom smart contract assets on Bitcoin can operate in parallel with BTC's own issuance schedule.

It reinforces Bitcoin's long-term fee market by incentivizing additional on-chain activity—all secured by the Bitcoin network itself.

As the first ALKANE, DIESEL establishes a model for future on-chain tokens with unique distribution rules, no extra protocol fees, and direct alignment with Bitcoin's security.

View the code for the DIESEL Genesis Alkane contract here:

https://github.com/kungfuflex/alkanes-rs/blob/main/crates/alkanes-std-genesis-alkane/src/lib.rs
