<!-- order: 7 -->

## Other SegWit Improvements

SegWit is not just new addresses. It brought structural changes to the protocol:

**Block weight limit.** Replaces the 1 MB limit with **4 million weight units**. Witness data counts less, allowing more transactions without increasing validation work for old nodes.

**Witness commitment.** Each block includes a `witness commitment` in the coinbase: a Merkle hash of the wtxids connected to the `coinbase witness`, making it costly to hide altered witness data.

**Malleability fix.** By excluding the witness from the txid, a third party can no longer change the signature to alter the transaction identifier before confirmation.

```python-sandbox
MAX_BLOCK_WEIGHT = 4_000_000
legacy_tx_bytes = 250
witness_bytes = 107
weight = legacy_tx_bytes * 4 + witness_bytes
print(f"Example tx weight: {weight}")
print(f"Similar txs per block (max): ~{MAX_BLOCK_WEIGHT // weight}")
---
Example tx weight: 1107
Similar txs per block (max): ~3613
```

**Future versions.** The witness program version byte (`OP_0` today) leaves room for new schemes (Taproot uses version 1).

> [!TIP]
> Nodes that do not understand SegWit still see valid transactions: witness fields appear empty and the legacy txid matches what they expect for the classic Merkle tree.
