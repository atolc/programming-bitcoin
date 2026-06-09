<!-- order: 3 -->

## Version

The first field of a transaction is a 32-bit integer in **little-endian** that indicates the format version.

| Version | Meaning |
|---------|---------|
| 1 | Satoshi's original format |
| 2 | BIP 68 (relative sequence) and BIP 112 (CHECKSEQUENCEVERIFY) |

The version does not change the basic structure of inputs and outputs, but activates additional consensus rules when nodes interpret it.

```python-sandbox
version = 2
serialized = version.to_bytes(4, "little")
print("Version 2 in bytes:", serialized.hex())
recovered = int.from_bytes(serialized, "little")
print("Recovered:", recovered)
```

> [!TIP]
> Most modern transactions use version 2. When parsing, always read exactly 4 bytes and convert with little-endian.
