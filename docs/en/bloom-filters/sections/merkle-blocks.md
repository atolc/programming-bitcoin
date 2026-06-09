<!-- order: 5 -->

## Getting Merkle Blocks

With the filter active, the wallet requests blocks via **`getdata`**, asking for objects of type **`MSG_MERKLEBLOCK`** (value 4 in BIP37). The node responds with a `merkleblock` that includes only the Merkle branches needed for transactions that match the filter.

Flow:

1. Peer announces a new block with `inv` (type `MSG_BLOCK` or `MSG_FILTERED_BLOCK`).
2. Wallet sends `getdata` requesting `MSG_MERKLEBLOCK` for that hash.
3. Node returns `merkleblock` + (optionally) matching transactions in separate `tx` messages.

```python-sandbox
MSG_MERKLEBLOCK = 4
MSG_TX = 1

request = {"type": MSG_MERKLEBLOCK, "hash": "abc123..."}
print(f"Requesting type {request['type']} (merkleblock)")
```

The wallet reconstructs the Merkle root from the `merkleblock` and compares it with the header it already has from the SPV chain.

> [!TIP]
> If the `merkleblock` does not include a transaction you expected, it may be a false negative from the filter (should not happen) or the transaction is not in that block. Verify the block hash and height.

## Section Completion

With a Bloom filter loaded, the wallet asks for filtered blocks rather than full blocks. The peer returns merkleblock messages that prove inclusion for matched transactions, plus separate tx messages for the transactions themselves. The wallet then verifies the Merkle proof against headers it already trusts.

This division matters: the merkleblock proves placement in a block, while the tx message gives the transaction contents to inspect. A wallet should not accept a transaction merely because a peer sent it; it should connect it to a valid Merkle proof and header chain.

