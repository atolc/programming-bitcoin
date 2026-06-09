<!-- order: 3 -->

## Block Headers

A block **header** is exactly **80 bytes** and summarizes the entire block without including the full transactions:

| Field | Size | Description |
|-------|------|-------------|
| `version` | 4 bytes | Block version |
| `prev_block` | 32 bytes | Hash of the previous block (little-endian) |
| `merkle_root` | 32 bytes | Merkle root of the transactions |
| `timestamp` | 4 bytes | Unix time of the block |
| `bits` | 4 bytes | Target encoded in compact format |
| `nonce` | 4 bytes | Number the miner varies when searching for PoW |

The block hash is computed by **double SHA-256** of the serialized header:

$$\text{block\_hash} = \text{SHA256}(\text{SHA256}(\text{header}))$$

```python-sandbox
import hashlib

def double_sha256(data: bytes) -> bytes:
    return hashlib.sha256(hashlib.sha256(data).digest()).digest()

# Fictional 80-byte header (all zeros except version=1)
header = b"\x01\x00\x00\x00" + b"\x00" * 76
block_hash = double_sha256(header)
print(block_hash[::-1].hex())  # display in big-endian
```

The `merkle_root` field connects the header to all transactions: changing a single transaction alters the root and therefore the block hash.

> [!TIP]
> Nodes can exchange headers only to synchronize the block chain without downloading every transaction. That is the foundation of lightweight clients (SPV), which we will cover later.
