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

## Section Completion

The version field is small, but it is consensus-significant. Version 1 represents the original transaction format, while version 2 is associated with relative locktime behavior from BIP68 and CHECKSEQUENCEVERIFY from BIP112. A parser should preserve the raw 4-byte little-endian integer even if the current lesson only prints it.

In practice, version does not tell you how many inputs or outputs exist; varints do that. Treat version as a rule selector, not as a schema selector. Future validation logic can inspect it when deciding whether sequence values have relative-lock semantics.

