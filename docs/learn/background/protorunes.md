---
sidebar_position: 2
---

# ProtoRunes: A Fungible Token Standard

## Overview

ProtoRunes is a fungible token standard for Bitcoin, designed to be simple and efficient. It uses OP_RETURN outputs to encode token operations, making it compatible with any Bitcoin implementation that supports standard transactions.

## Key Features

- Simple encoding scheme using OP_RETURN outputs
- Support for basic token operations (mint, transfer)
- Efficient parsing and validation
- No dependency on witness data
- Minimal transaction size overhead

## Protocol Design

ProtoRunes uses a simple prefix-based encoding scheme in OP_RETURN outputs:

- Deploy: `OP_RETURN <PROTORUNES_PREFIX> <DEPLOY> <symbol> <supply>`
- Transfer: `OP_RETURN <PROTORUNES_PREFIX> <TRANSFER> <id> <amount>`

The protocol is designed to be as minimal as possible while still providing the essential functionality needed for fungible tokens on Bitcoin.

## Implementation Details

ProtoRunes messages are encoded in OP_RETURN outputs with a maximum size of 80 bytes. The protocol prefix helps identify ProtoRunes transactions during chain scanning.

### Message Types

1. Deploy Token

   - Creates a new token with specified symbol and supply
   - Token ID is derived from the deployment transaction

2. Transfer Token
   - Moves tokens between addresses
   - References token ID and specifies amount

### State Management

The protocol maintains minimal state:

- Token metadata (symbol, total supply)
- Address balances
- Transaction history

## Benefits

- Minimal transaction overhead
- Easy to implement and validate
- Compatible with existing Bitcoin infrastructure
- No special transaction types required
