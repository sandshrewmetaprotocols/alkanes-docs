---
title: Background: PROTORUNES
---

# Background: PROTORUNES

In this section we describe a specification for a family of metaprotocols derived from the runes metaprotocol, to enable different classes of token standards with limited compatibility for trade, but within their own metaprotocol rules can be customized in arbitrary ways within the constraints of the overarching acheme.

# ALKANES is a protorunes-compatible subprotocol

If we accept the term "subprotocol" to refer to a metaprotocol that is derived from some parent metaprotocol, we can then construct an understanding of protorunes as an asset class and metaprotocol architecture.

Protorunes are protocol assets that are indexed within a subprotocol of runes, which meet certain requirements. Protorunes by themselves inherit properties of runes, but exist via some interesting ways to process a Runestone message without breaking the runes metaprotocol.

Protorunes were originally introduced on social media and gained some notoriety as programmable runes. However, protorunes themselves are not smart contract assets. It is more accurate to say that the design of protorunes enables smart contract protocols to be built. ALKANES is exactly this: a subprotocol designed as protorunes-compatible, which extends protorunes assets into a smart contract asset class with a shared environment and therefore composable, as we are used to on DeFi.

It becomes more interesting if different variants of ALKANES may be launched with different protocol IDs, with unique properties. The reason it is interesting is because the scope of assets we define all live on Bitcoin L1, and since we can signal an intent to two subprotocols in one transaction using the Runestone structure, we can swap value stored on UTXOs across different subprotocols. The reason this is powerful is because as users of a subprotocol, we only have to run the compute for one indexer to interact with its ecosystem in a decentralized manner. This enables a world where we can choose to create DeFi as a horizontally sharded landscape and fixes a critical scaling problem in smart contract systems that we are used to. With such a mechanism, we can create a scalable world for DeFi and open finance, and we can do it on Bitcoin.

# Definitions

## protoburn

A protoburn is a mechanism by which runes are burned and a subprotocol-only representation is transferred onto a UTXO, to be indexed accordingly by the subprotocol indexer. The RuneId identifier for the asset is the same as it occurs on the runes metaprotocol, as it relates to transferring the assets with Edict structures packed into the Protocol messages for our extended Runestone. A protoburn is targeted by a Runestone pointer or edict on the runes protocol in a way that renders those runes provably unspendable, but does not result in a cenotaph. To target a protoburn, an Edict pointer targets the OP_RETURN output that the Runestone itself lives on. Edicts that target the OP_RETURN output are handled once per rune. i.e. for two edicts for the same RuneId that declare a transfer to the OP_RETURN, the first edict targets the first protoburn in the set of Protostones, the second edict targets the second protoburn, etc. It is by this mechanism we can provide a way to order a set of operations packed into a protocol message succinctly, since Edict structures in a Runestone must appear in a sorted order.

When evaluating protoburns, a protoburn may specify the `From` tag, where each value in this list is interpreted as a u32 representing the index of the edict which should be taken to be the source of value transferred into the protoburn. Protoburns which specify the `From` tag are evaluated first, and edicts defined in this field are skipped as protoburns which do not specify a `From` are evaluated. In processing the set of protoburns which specify a `From` tag, a repeated appearance of an edict already specified in an earlier protoburn is safely ignored.

## protorunes

Protorunes are runes that have been protoburned and no longer are recognized as spendable by the usual Runestone edicts. To transfer protorunes, it is required to use Protostone objects packed into the Protocol field of a Runestone.

## subprotocol

A subprotocol is a metaprotocol that runs the indexer program of its parent protocol as a dependency.

## protorunes-compatible

A protorunes-compatible subprotocol is a subprotocol of runes, which therefore must as a dependency run the runes indexing logic. Additionally, if a subprotocol is protorunes-compatible then it MUST correctly interpret and process the data structures described in this document, which includes the processing of Runestone and any edicts it contains, as well as the parsing of the Protocol field, which will never clash with the set of fields we will see in this version of runes or any protocol upgrades, for reasons we will describe.

## protomessage

A protomessage is an OP_RETURN output which can be the target of one or more edicts, the target of a protoburn, or the target of another protomessage. A protomessage output must delegate the sum of value that targets it to the pointer and refund_pointer, crediting any assets not forwarded to either pointer to the runtime itself. The sum of runes which exist on a subprotocol MUST NOT exceed the sum of runes bridged into a subprotocol. Subprotocols may define protorune assets, which exist exclusively on the subprotocol, but can be transferred/minted/burned or otherwise transacted against by the protocol runtime, provided the encoding of their RuneId can still be parsed as two u128 values.

## ProtoTag

Below are the different fields possible in a Protostone structure:

```rust
enum ProtoTag {
  Body = 0,
  Message = 81,
  Burn = 83,
  Pointer = 91,
  Refund = 93,
  From = 95,
  Cenotaph = 126,
  Nop = 127
}
```

## Protostone

When constructing the full Protostone, the final data structure should be organized as follows:

```rust
struct Protostone {
  edicts: Vec<Edict>,
  pointer: Option<u32>,
  refund_pointer: Option<u32>,
  burn: Option<u128>,
  message: Option<Vec<u8>>,
  from: Option<Vec<u32>>
}
```

### Message field (calldata)

Also known as the `calldata` to the MessageContext.

This is an buffer of data that can be arbitrarily large. The sdk will automatically break down the calldata into tags that the indexer can pick up and piece back together. A magic number (0x01) is added to the start of the calldata to indicate the start of arbitrary data. If the first byte of calldata is not the magic number, then the entire calldata is zeroed out.

Any bytes that are 0x00 starting from the end will be dropped, until we read the first non zero byte. If the first non zero byte is not the magic end number (0x01), then the calldata will be zeroed out.

## Delta-encoding

Edicts in a Protostone are delta-encoded, the same as they are in a top-level Runestone. They also, naturally, must be sorted prior to their encoding.

## LEB128 Context

LEB128 (Little Endian Base 128) is a variable-length encoding used to represent arbitrarily large integers in a compact form. The primary advantage of LEB128 is that it can represent small numbers in fewer bytes, which helps save space.

# Indexing

## Indexing Protoburns

A protoburn is used to burn runes onto a subprotocol, and is generally a one-way function. A subprotocol may allow a protoburn from a sibling subprotocol, if it decides that the indexer for the given subprotocol is sound and is willing to honor incoming assets. Alternatively, protorunes on different subprotocols or runes itself can be exchanged via the usual protocol features of runes and Bitcoin itself.

A protoburn message is a Protostone embedded within the Protocol field of a Runestone, for which the protocol tag is 13 (the runes protocol tag).

A protoburn is targeted ONCE per edict per rune, in the order protoburns appear in the Protocol array. Exceeding the range of protoburns simply treats the list of protoburns as cyclic, starting at the beginning when the list is consumed for a rune.

The protocol tag within the protoburn message SHOULD be unique for the subprotocol. A protocol tag is a u128 value which appears in a Protostone as a leb128 encoded value. The bytearray representing the Protostone, described in an earlier section, is similarly encoded with leb128.

## Indexing Protomessages

A protomessage is a protocol message that an indexer must interpret as an action on the subprotocol.

Upon parsing a Protostone, the Message field will contain a bytearray which SHOULD be then parsed with protobuf or any serializer expected by the subprotocol, then interpreted as an argument to the runtime of the subprotocol. Protorunes MUST be output to the locations pointed to by the `pointer` tag in Protostone or the inputs refunded to the `refund_pointer` if the runtime decides it should not execute against its input of runes and calldata.

Protorunes which target the Protostone that are unused by the runtime MUST be returned to the refund_pointer.

## Indexing Edicts

Protostones can make use of the 0 tag to encode edicts. If edicts are present, only the edicts and the pointer within a Protostone have any effect. Balance changes marked by edicts are computed as deltas, as usual. If a pointer is present, unallocated protorunes follow the pointer. Otherwise, they are considered to be inputs to the following Protostone for that subprotocol.

Edicts are processed after a message is evaluated, and the remaining balance sheet on the protostone follows the pointer.
