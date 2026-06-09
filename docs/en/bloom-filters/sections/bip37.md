<!-- order: 3 -->

## BIP37: Bloom Filters

**BIP37** defines how lightweight wallets use Bloom filters with nodes that advertise the `NODE_BLOOM` service.

Filter parameters:

| Field | Meaning |
|-------|---------|
| `filter_bytes` | Size of the bit vector |
| `nHashFuncs` | Number of hash functions (max. 50) |
| `nTweak` | Seed for deriving the functions |
| `nFlags` | `BLOOM_UPDATE_NONE`, `_ALL`, `_P2PUBKEY_ONLY` |

Nodes use **murmur3** with `nTweak` to compute the position of each element. When adding a transaction to a block, the node evaluates whether any relevant byte (outputs, inputs, witness) matches the filter.

```python-sandbox
BLOOM_UPDATE_NONE = 0
BLOOM_UPDATE_ALL = 1
BLOOM_UPDATE_P2PUBKEY_ONLY = 2

filter_params = {
    "size": 36000,
    "nHashFuncs": 7,
    "nTweak": 0x12345678,
    "nFlags": BLOOM_UPDATE_P2PUBKEY_ONLY,
}
print(f"Filter: {filter_params['size']} bytes, {filter_params['nHashFuncs']} functions")
```

> [!TIP]
> BIP37 has lost popularity to BIP157/158 (compact block filters) because a malicious node can infer addresses by correlating filters. Still, understanding BIP37 is key to reading legacy code and this book.
