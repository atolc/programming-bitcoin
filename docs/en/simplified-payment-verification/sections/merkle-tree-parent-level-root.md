<!-- order: 3 -->

## Merkle Tree: Parent, Level, and Root

A block's transactions are organized in a binary **Merkle tree**. Each leaf is the hash of a transaction (double SHA-256). Each internal node is the hash of the concatenation of its two children:

$$\text{parent}(h_L, h_R) = \text{SHA256}(\text{SHA256}(h_L \parallel h_R))$$

If there is an odd number of nodes at a level, the last one is **duplicated** before pairing.

```python-sandbox
import hashlib

def merkle_parent(h1: bytes, h2: bytes) -> bytes:
    return hashlib.sha256(hashlib.sha256(h1 + h2).digest()).digest()

def merkle_level(hashes):
    if len(hashes) == 1:
        return hashes
    if len(hashes) % 2 == 1:
        hashes = hashes + [hashes[-1]]
    return [merkle_parent(hashes[i], hashes[i+1]) for i in range(0, len(hashes), 2)]

tx_hashes = [bytes([i]) * 32 for i in range(4)]
level1 = merkle_level(tx_hashes)
root = merkle_level(level1)[0]
print("Root:", root[:4].hex())
---
Root: 5d0a4f2c
```

The **Merkle root** (`merkle_root`) is stored in the block header. Changing any transaction alters the root and therefore the block hash.

A **Merkle proof** for transaction $T$ consists of the sibling hashes along the path from $T$'s leaf to the root. With those hashes the client recomputes the root and compares it to the one in the header it already validated.

> [!TIP]
> The order of transactions in the block matters: your transaction's position determines which sibling hashes you need in the proof.
