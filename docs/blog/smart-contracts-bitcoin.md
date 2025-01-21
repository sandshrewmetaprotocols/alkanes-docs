---
id: smart-contracts-bitcoin
title: Alkanes Smart Contracts on Bitcoin
sidebar_label: Smart Contracts on Bitcoin
---

# ALKANES: Smart Contracts on Bitcoin UTXOs

_Posted on Nov 28, 2024 • Edited on Dec 14, 2024_

<div style={{
  aspectRatio: '1/1',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid var(--ifm-color-emphasis-200)',
  width: '100%',
  height: '100%',
  position: 'relative',
  marginTop: '20px',
  marginBottom: '40px',
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
    <source src="/img/video2.mp4" type="video/mp4" />
  </video>
</div>

ALKANES is an application layer built directly on Bitcoin where individuals or teams can deploy smart contracts to Bitcoin L1. ALKANES is one example of a metaprotocol, which is a set of rules and definitions to process block history in a blockchain system, to add additional features and concepts built on its data.

ALKANES is my conception of a metaprotocol project which inherits structures and design patterns from the very popular ordinals and runes metaprotocol projects, authored by Casey Rodarmor. From ordinals, we use the concept of the inscription envelope, but a more minimal variant of it, which we will simply call the witness envelope. We use the witness envelope, at minimum, to deploy \*.wasm.gz files to the Bitcoin blockchain, after which they can be transacted against as smart contract programs, using any combination of inputs of value, data, and the context of the transaction itself.

With the _.wasm.gz file format of ALKANES smart contracts, we can build smart contracts in a language like Rust, and build contracts that are very much within the size constraints we must work within, when deploying to something like the Bitcoin blockchain. In fact, as an experiment, I forked the noir VM to a slightly modified version that would play nice with the alkanes build system, and I used it to do a minimal build of an alkane smart contract capable of verifying a proof for a zk-circuit compiles with the AZTEC noir project. The final binary filesize was 550kb, but when gzipped to a _.wasm.gz, was merely 150kb.

This means there is a world of possibilities for what we can accomplish on Bitcoin as it exists today.

For its regular operation, ALKANES inherits from the runes metaprotocol as well as ordinals. We do in fact use the Runestone structure as it is defined in the runes specification, but in a way that is harmless to indexers tracking the state of runes, and also, in a way where it is possible to compose transfers of runes and alkanes as part of a swap transaction, which has the correct effect on indexers tracking the state of either metaprotocol.

Inheriting from these two metaprotocols means we have a lot of open source software in the ecosystem already that we can tap into. I ported modified versions of @magiceden-oss/runestone-lib and also micro-ordinals from the desk of the prolific https://github.com/paulmillr, into the alkanes TypeScript repository here:

https://github.com/kungfuflex/alkanes

This library is usable for constructing transactions that can both deploy and transact against alkanes smart contracts, and an example of a complete program flow can be found here:

https://github.com/kungfuflex/alkanes/tree/main/integration/genesis.spec.ts

In this repository I have also written a docker-compose.yaml which provides a full regtest environment and supplementary database, usable to run the integration test mentioned above, but also to build applications! Indeed, it is possible to build applications that are even more expressive than what we have seen in traditional DeFi systems, using the combined power of LLVM and the paritytech wasmi interpreter / WebAssembly runtime, entirely on native Bitcoin L1.

## What can an ALKANE do?

An alkane smart contract is very much a Bitcoin native construct. First and foremost, it is always a token, whether or not it actually does anything with its own balance sheet. It can hold a balance sheet of itself as well as other alkanes, the same that a UTXO can hold alkanes or runes. This idea actually resonated with me when Andre Cronje explained to me his thesis on DeFi many years ago, applied to his vision for YFI.

In simple terms: "make every contract an ERC20."

This happens to provide a consistent model for interoperability that helped DeFi take form, and I wanted this to exist as a primitive within ALKANES, bearing the improvement that a transfer of assets always invokes the code of the recipient, so we can always do everything in one transaction in the UX we build.

What else?

An alkane can:

- Check balances of alkanes
- Read/write to storage for the alkane
- Check how much fuel is left to execute code
- Access the transaction bytes of the Bitcoin transaction executing the alkane
- If it is present, read one or more witness envelope structures present with the transaction, when we need to send a transaction with large payloads such as a zk proof, merkle proof, or quantum safe signature
- Compute the address that the output will be spent to, or otherwise check the Bitcoin vmscript on the output that the output of some alkanes action will end up on, if we want to check for covenants, enforce conditions on spending, or other novel uses of OP_CAT even. Building on UTXOs mean we have the benefit of being able to extend Bitcoin scripting as we normally use it, and get the benefit of new opcodes as they occur, if they do.
- Access the entire block bytes which the current transaction is running within
- Programmatically determine who the miner of the current block is (we may want to bribe this individual in our transaction, perhaps)
- Act upon the transfer of value sent with the transaction, in terms of the combined balance sheet of alkanes spent into the action
- Access the ID for the alkane calling the current alkane, if they call each other
- Access the ID for the alkane executing code
- Call another alkane
- Delegate to another alkane (upgradeability, libraries)
- Call another alkane but prevent side effects
- Get the next sequence number, usable also if an alkane is created by an alkane in a transaction and its ID should be computed

I tried not to get too much fancier than this, since everything else should be doable in userspace.

## Indexer

The indexer for ALKANES itself actually builds to WASM. So, it is true that the WASM VM for an alkane, is itself, built to WASM. The reason it was possible to build a metaprotocol that was deterministic and which meets the strict integrity requirements of a metaprotocol indexer built on top of a blockchain consensus model, is because we have something like metashrew, which is a generic metaprotocol indexer stack capable of running WASM programs expressing a metaprotocol.

https://github.com/sandshrewmetaprotocols

Metashrew is itself an extensive project and warrants a separate article to properly introduce, but the easy way to put it is that it is a software stack that reduces the problem of architecting a complex metaprotocol, by a considerable degree.

The ALKANES indexer program is a pure Rust project built with bindings to the metashrew runtime. To verify that the version of the ALKANES indexer, and therefore the index it builds, is consistent with what is expected, it is simple enough to just compare the SHA256 hash of the WASM binary for alkanes.wasm to a known value. I have actually had to do this quite a few times for easy sanity checks while debugging in the indexer WASM. Very convenient.

The metashrew software comes with metashrew-view, which is a minimal JSON-RPC service that will execute the same WASM for the indexer but in a way where there cannot be side effects of calling function. The process can be parallelized and provides a way you can multiprocess potentially heavy compute to render the state or a simulated effect of the indexer. In ALKANES we actually export a simulate function that allows you to run any protocol message or transaction against an alkane WASM, and this functions similar to what we are used to from Ethereum and refer to as view functions, but it is more comprehensive. You can simulate and compute fuel costs of a protocol message, mock any inputs desired as the balance sheet of assets you are spending into the transaction, get the list of expected alkanes that will be output from the transaction, see the list of storage updates as a result of the transaction, and of course, do all of it as if we are at an earlier block height than the current tip, if we want to see historical state.

## What's next?

Well, it is true that people are excited already. We have projects deploying stablecoins, AMM systems, explorers, and of course we will have wallet support within OYL coming, so many of the pieces are already there or otherwise are staged to appear.

Join us in the SANDSHREWサンド Discord where we discuss ALKANES and the greater ecosystem of metaprotocols we will come to know, as we enter the next chapter of Bitcoin.

https://discord.gg/anPUpQtPzg

## Links

### Software

https://github.com/kungfuflex/alkanes-rs
https://github.com/kungfuflex/alkanes

### Announcements

https://x.com/judoflexchop

### Specifications

https://github.com/kungfuflex/alkanes-rs/wiki
