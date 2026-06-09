<!-- order: 4 -->

## Merkle Blocks

A **`merkleblock`** message combines a block header with a partial Merkle proof and flag metadata. This way a full node can prove that certain transactions are in the block without sending all transactions.

Simplified structure:

```
[header: 80 bytes]
[total_transactions: varint]
[hashes: varint + list of internal hashes needed for the proof]
[flags: varint + bits marking which leaves are of interest]
```

The SPV client:

1. Verifies the header (`prev_block` link + PoW).
2. Uses `hashes` and `flags` to reconstruct the Merkle root.
3. Compares that root with `merkle_root` in the header.

```python-sandbox
def verify_merkle_root(computed: bytes, header_root: bytes) -> bool:
    return computed == header_root

header_merkle_root = bytes.fromhex("ab" * 32)
computed_root = bytes.fromhex("ab" * 32)
print("Valid proof?", verify_merkle_root(computed_root, header_merkle_root))
```

If the root matches, the transaction of interest is **committed** in that block. Confirmation depth (blocks chained after) measures how much to trust the irreversibility of the payment.

> [!TIP]
> A malicious `merkleblock` could omit transactions in the flags. That is why the client must reconstruct the full tree according to BIP37 and reject inconsistent proofs.
