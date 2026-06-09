<!-- order: 2 -->

## Byte Order (Endianness)

A 32-bit integer such as $305419896$ ($0x12345678$) can be stored in memory in two ways:

- **Big-endian**: most significant byte first → `12 34 56 78`
- **Little-endian**: least significant byte first → `78 56 34 12`

Bitcoin mixes both styles depending on context:

| Field | Typical endianness |
|-------|-------------------|
| Transaction version | Little-endian |
| Output value (satoshis) | Little-endian |
| Block hash in explorers | Big-endian (display) |
| Internal hash in protocol | Little-endian |

```python-sandbox
n = 0x12345678
big = n.to_bytes(4, "big")
little = n.to_bytes(4, "little")
print("big-endian:   ", big.hex())
print("little-endian:", little.hex())
---
big-endian:    12345678
little-endian: 78563412
```

> [!TIP]
> When a hash is shown in a block explorer, it is usually displayed in **big-endian** (more readable). Internally, when serializing transactions, many fields use **little-endian**. Always check the context before comparing bytes.
