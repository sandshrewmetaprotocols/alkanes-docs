---
sidebar_position: 2
title: Protorunes Specification
description: Deep dive into Protorunes - the foundational protocol layer for Alkanes that enables native Bitcoin token functionality. Learn about token creation, management, and the technical specifications of this revolutionary Bitcoin L1 protocol.
keywords:
  - Protorunes protocol
  - Bitcoin tokens
  - Bitcoin L1 tokens
  - OP_RETURN tokens
  - Bitcoin token standard
  - Alkanes tokens
  - Bitcoin fungible tokens
  - UTXO tokens
image: img/sandshrew.svg
---

# Protorunes Specification

In this section we describe a specification for a family of metaprotocols derived from the runes metaprotocol, to enable different classes of token standards with limited compatibility for trade, but within their own metaprotocol rules can be customized in arbitrary ways within the constraints of the overarching scheme.

## ALKANES is a protorunes-compatible subprotocol

If we accept the term "subprotocol" to refer to a metaprotocol that is derived from some parent metaprotocol, we can then construct an understanding of protorunes as an asset class and metaprotocol architecture.

Protorunes are protocol assets that are indexed within a subprotocol of runes, which meet certain requirements. Protorunes by themselves inherit properties of runes, but exist via some interesting ways to process a Runestone message without breaking the runes metaprotocol.

Protorunes were originally introduced on social media and gained some notoriety as programmable runes. However, protorunes themselves are not smart contract assets. It is more accurate to say that the design of protorunes enables smart contract protocols to be built. ALKANES is exactly this: a subprotocol designed as protorunes-compatible, which extends protorunes assets into a smart contract asset class with a shared environment and therefore composable, as we are used to on DeFi.

It becomes more interesting if different variants of ALKANES may be launched with different protocol IDs, with unique properties. The reason it is interesting is because the scope of assets we define all live on Bitcoin L1, and since we can signal an intent to two subprotocols in one transaction using the Runestone structure, we can swap value stored on UTXOs across different subprotocols. The reason this is powerful is because as users of a subprotocol, we only have to run the compute for one indexer to interact with its ecosystem in a decentralized manner. This enables a world where we can choose to create DeFi as a horizontally sharded landscape and fixes a critical scaling problem in smart contract systems that we are used to. With such a mechanism, we can create a scalable world for DeFi and open finance, and we can do it on Bitcoin.

## Definitions

### protoburn

A protoburn is a mechanism by which runes are burned and a subprotocol-only representation is transferred onto a UTXO, to be indexed accordingly by the subprotocol indexer. The RuneId identifier for the asset is the same as it occurs on the runes metaprotocol, as it relates to transferring the assets with Edict structures packed into the Protocol messages for our extended Runestone. A protoburn is targeted by a Runestone pointer or edict on the runes protocol in a way that renders those runes provably unspendable, but does not result in a cenotaph. To target a protoburn, an Edict pointer targets the OP_RETURN output that the Runestone itself lives on. Edicts that target the OP_RETURN output are handled once per rune. i.e. for two edicts for the same RuneId that declare a transfer to the OP_RETURN, the first edict targets the first protoburn in the set of Protostones, the second edict targets the second protoburn, etc. It is by this mechanism we can provide a way to order a set of operations packed into a protocol message succinctly, since Edict structures in a Runestone must appear in a sorted order.

When evaluating protoburns, a protoburn may specify the From tag, where each value in this list is interpreted as a u32 representing the index of the edict which should be taken to be the source of value transferred into the protoburn. Protoburns which specify the From tag are evaluated first, and edicts defined in this field are skipped as protoburns which do not specify a From are evaluated. In processing the set of protoburns which specify a From tag, a repeated appearance of an edict already specified in an earlier protoburn is safely ignored.

### protorunes

Protorunes are runes that have been protoburned and no longer are recognized as spendable by the usual Runestone edicts. To transfer protorunes, it is required to use Protostone objects packed into the Protocol field of a Runestone.

### subprotocol

A subprotocol is a metaprotocol that runs the indexer program of its parent protocol as a dependency.

### protorunes-compatible

A protorunes-compatible subprotocol is a subprotocol of runes, which therefore must as a dependency run the runes indexing logic. Additionally, if a subprotocol is protorunes-compatible then it MUST correctly interpret and process the data structures described in this document, which includes the processing of Runestone and any edicts it contains, as well as the parsing of the Protocol field, which will never clash with the set of fields we will see in this version of runes or any protocol upgrades, for reasons we will describe.

#### protomessage

A protomessage is an OP_RETURN output which can be the target of one or more edicts, the target of a protoburn, or the target of another protomessage. A protomessage output must delegate the sum of value that targets it to the pointer and refund_pointer, crediting any assets not forwarded to either pointer to the runtime itself. The sum of runes which exist on a subprotocol MUST NOT exceed the sum of runes bridged into a subprotocol. Subprotocols may define protorune assets, which exist exclusively on the subprotocol, but can be transferred/minted/burned or otherwise transacted against by the protocol runtime, provided the encoding of their RuneId can still be parsed as two u128 values. For a RuneId of a subprotocol asset, at least one bit must be set in the high 64 bits of the u128 encoding of what is traditionally the height of the block for a given etching, OR one bit is set in the high 96 bits of what is traditionally the txindex of the transaction for a given etching. This permits us to define a space of custom assets exclusive to the subprotocol which are still compatible and can be transacted with using the Runestone structure, while at the same time ensuring that we cannot clash with the space of RuneIds on the runes protocol.

#### predicate

A predicate is a set of clauses that define the minimum balance sheet of protorunes which MUST exist on the output a protomessage points to. If the predicate is not satisfied, a protomessage must have no side effect. The balance sheet of protorunes MUST, in this case, be transferred to the output defined by the refund_pointer. A standard predicate structure does not occur in the data structures used in protorunes, since it is not needed in every subprotocol and may need to be modeled in different ways in different contexts, but this vocabulary is provided to model a concept which should be a feature of protorune runtime messages for which there is settlement risk.

A predicate mechanism should be available to the user in any instance where a reorg of the Bitcoin blockchain could change the balance sheet held by an input being used in a way that is significant to transactions which follow it. In cases where this occurs, we ensure that all value being used as inputs to a protomessage are safely returned to the refund_pointer.

## Protocol Messages

### Design Goals
To preserve the feature where we can execute atomic swaps and can allow for the use of PSBTs, to construct expressive market mechanics that transact between sibling subprotocols (not exclusively the canonical alkanes subprotocol of protocol ID 1), we would like to make use of the Runestone structure and extend its use in a way where we can embed protocol messages for protorunes within the Runestone structure without causing a cenotaph.

We do this by adding a new ODD field of the Runestone structure and claim one protocol field which does not conflict with future versions of the runes metaprotocol. The runes specification indicates that a tag within the range of protocol field values will never exceed 1 byte in its leb128 encoding, thus why the author of the runes specification terminates the range of Tag values at 127. We have the remaining space of a u128 to claim territory safely. Thus, we choose 2**14 - 1 (16383) which is the largest possible value in the u128 byte space which occupies only 2 bytes in leb128 encoding. This, we are confident, will never disturb the evolution of the runes metaprotocol.

We end up with the final structure:

```json
enum Tag {
  Body = 0,
  Flags = 2,
  Rune = 4,
  Premine = 6,
  Cap = 8,
  Amount = 10,
  HeightStart = 12,
  HeightEnd = 14,
  OffsetStart = 16,
  OffsetEnd = 18,
  Mint = 20,
  Pointer = 22,
  Cenotaph = 126,
  Divisibility = 1,
  Spacers = 3,
  Symbol = 5,
  Nop = 127,
  Protocol = 16383,
}
```

### Parsing
The Protocol field in a Runestone, consistent with the rest of the structure, is encoded as u128[]. These values are concatenated to form a single bytearray and parsed, intuitively, as an embedded list of leb128 encoded values. Encoding the array this way makes more efficient use of the Runestone structure by avoiding repeating the Tag for Protocol in most cases. To ensure the range of bytearrays does not exclude any bitfields within its terminal bytes, we choose a maximum length for a u128 value within a u128[] intended for interpretation as a u8[] to 15 bytes. This allows us to safely model an arbitrary bytearray within the Runestone paradigm.

The u128[] produced by decoding the list of leb128 values is interpreted one Protostone at a time. First, a subprotocol tag is parsed which should declare the protocol that the message targets. For protoburns this is 13, the protocol tag for the runes protocol. The next leb128 decodes to the amount of leb128 encoded values which should follow that encode the field/value pairs in the Protostone. Finally, the leb128 values are parsed in the declared quantity and interpreted as pairs, similar to the parsing of Runestone. In the same way that a Runestone is parsed, when a 0 tag is encountered, the remaining leb128 values are interpreted in sets of 4 as Edict structures, but which operate on the subprotocol.

In Runestone and Protostone, respectively, we have Protocol and Message potentially present, which are each a u128[] array which must be interpreted as a u8[]. Again, to ensure that we can make use of the full bitvector we pack into each u128, it is required that no u128 packed in these fields exceed 15 bytes in size.

### ProtoTag
Below are the different fields possible in a Protostone structure:

```json
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

### Protostone
When constructing the full Protostone, the final data structure should be organized as follows:

```json
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
Also known as the calldata to the MessageContext.

This is an buffer of data that can be arbitrarily large. The sdk will automatically break down the calldata into tags that the indexer can pick up and piece back together. A magic number (0x01) is added to the start of the calldata to indicate the start of arbitrary data. If the first byte of calldata is not the magic number, then the entire calldata is zeroed out.

Any bytes that are 0x00 starting from the end will be dropped, until we read the first non zero byte. If the first non zero byte is not the magic end number (0x01), then the calldata will be zeroed out.

### Delta-encoding
Edicts in a Protostone are delta-encoded, the same as they are in a top-level Runestone. They also, naturally, must be sorted prior to their encoding.

### LEB128 Context
LEB128 (Little Endian Base 128) is a variable-length encoding used to represent arbitrarily large integers in a compact form. The primary advantage of LEB128 is that it can represent small numbers in fewer bytes, which helps save space.

More information can be found on the Rune Specification

### Indexing
An indexer for a protorunes subprotocol will, as a requirement, evaluate and index the runes Runestone structure first, before parsing the Protostones from the Protocol field of the Runestone. A subprotocol indexer will, at the very least, evaluate Protostones tagged with the subprotocol ID it is indexing. For ALKANES, this is 1. If a subprotocol is descendent of another subprotocol, it will index its parent subprotocols as well and can opt in to honoring protoburns from them. The different types of Protostones are evaluated according to the logic described below.

### Indexing Protoburns
A protoburn is used to burn runes onto a subprotocol, and is generally a one-way function. A subprotocol may allow a protoburn from a sibling subprotocol, if it decides that the indexer for the given subprotocol is sound and is willing to honor incoming assets. Alternatively, protorunes on different subprotocols or runes itself can be exchanged via the usual protocol features of runes and Bitcoin itself.

A protoburn message is a Protostone embedded within the Protocol field of a Runestone, for which the protocol tag is 13 (the runes protocol tag).

A protoburn is targeted ONCE per edict per rune, in the order protoburns appear in the Protocol array. Exceeding the range of protoburns simply treats the list of protoburns as cyclic, starting at the beginning when the list is consumed for a rune.

The protocol tag within the protoburn message SHOULD be unique for the subprotocol. A protocol tag is a u128 value which appears in a Protostone as a leb128 encoded value. The bytearray representing the Protostone, described in an earlier section, is similarly encoded with leb128.

The pointer within the Protostone MUST contain the index of a spendable UTXO within the transaction outputs OR a Protostone, where the numbering of Protostones begins at the end of the numbering for outputs and AFTER the output index that is reserved in the runes protocol for a multicast edict. The numbering of shadow vouts begins, then, at outs.length + 1. For a protoburn, this will be where protorunes end up. The Message field and Refund field of a Protostone encoding a protoburn are ignored, but it is possible for the pointer to target a protomessage, for atomic execution against the subprotocol.

All edicts in a Runestone that target a protoburn are delegated to the pointer in the Protostone, which MAY be a spendable UTXO or another Protostone encoding a protomessage for that subprotocol.

NOTE: Behavior of Runestone with respect to the multicast output (referenced as vout = outs.length) is, of course, preserved, in that the indexer must honor edicts that point to this output the normal way, where the value is spread across the range of all outputs, NOT including the shadow vout range. There is no equivalent to the runes multicast output within the protorunes standard, with respect to the shadow vout range.

### Indexing Protomessages
A protomessage is a protocol message that an indexer must interpret as an action on the subprotocol.

Upon parsing a Protostone, the Message field will contain a bytearray which SHOULD be then parsed with protobuf or any serializer expected by the subprotocol, then interpreted as an argument to the runtime of the subprotocol. Protorunes MUST be output to the locations pointed to by the pointer tag in Protostone or the inputs refunded to the refund_pointer if the runtime decides it should not execute against its input of runes and calldata.

Protorunes which target the Protostone that are unused by the runtime MUST be returned to the refund_pointer.

The pointers are named for simplicitly in terms of their intended function, but ultimately they provide a mechanism for a branch in execution outputs which can, in turn, target another Protostone. In this way the scheme can support an unlimited amount of protorunes recipients in a given transaction script.

Generally, the refund_pointer SHOULD be expected to be spendable by the entity which signed the transaction inputs, in the same way a change output is typically used on Bitcoin. A refund_pointer may point to another Protostone, but the tree of execution SHOULD be expected to have terminal refund_pointers which are UTXOs spendable by the entity which signed the transaction inputs.

Recursion of protomessages within a transaction is not permitted by the protorunes design. See the section on ordering for details.

### Indexing Edicts
Protostones can make use of the 0 tag to encode edicts. If edicts are present, only the edicts and the pointer within a Protostone have any effect. Balance changes marked by edicts are computed as deltas, as usual. If a pointer is present, unallocated protorunes follow the pointer. Otherwise, they are considered to be inputs to the following Protostone for that subprotocol.

Edicts are processed after a message is evaluated, and the remaining balance sheet on the protostone follows the pointer.

## Next Steps

- Learn about [Contract Interaction](./contracts-interaction.md)
- Explore [DApp Integration](./dapp-integration.md)
- Study the [RPC Interface](./rpc.md)
