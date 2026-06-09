<!-- order: 2 -->

## Bloom Filter Concept

A **Bloom filter** is a probabilistic structure that answers whether an element **might** be in a set. It allows **false positives** (it says "yes" when the element is not there) but not false negatives (if it says "no", the element is definitely not there).

It is implemented with a bit vector and several hash functions. To insert an element, $k$ positions are set; to query, the same positions are checked.

```python-sandbox
class BloomFilter:
    def __init__(self, size: int, num_functions: int):
        self.bits = [0] * size
        self.num_functions = num_functions

    def _indexes(self, item: bytes):
        import hashlib
        for i in range(self.num_functions):
            h = hashlib.sha256(item + bytes([i])).digest()
            yield int.from_bytes(h[:4], "big") % len(self.bits)

    def add(self, item: bytes):
        for idx in self._indexes(item):
            self.bits[idx] = 1

    def probably_contains(self, item: bytes) -> bool:
        return all(self.bits[idx] for idx in self._indexes(item))

bf = BloomFilter(64, 3)
bf.add(b"mi_direccion")
print(bf.probably_contains(b"mi_direccion"))
print(bf.probably_contains(b"otra"))
```

For SPV wallets, the filter represents the addresses or scripts you care about. The full node compares each transaction in the block against the filter and only forwards probable matches.

> [!TIP]
> The more elements you insert or the fewer bits you use, the higher the false positive rate: you will receive unrelated transactions and spend more bandwidth.
