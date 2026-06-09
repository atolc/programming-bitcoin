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
```

> [!TIP]
> When a hash is shown in a block explorer, it is usually displayed in **big-endian** (more readable). Internally, when serializing transactions, many fields use **little-endian**. Always check the context before comparing bytes.

### Integer Helpers

Bitcoin code often wraps byte-order conversions in explicit helpers so call sites document their intent.

```python-sandbox
def little_endian_to_int(raw):
    return int.from_bytes(raw, "little")

def int_to_little_endian(n, length):
    return n.to_bytes(length, "little")

raw = bytes.fromhex("78563412")
n = little_endian_to_int(raw)
print(n)
print(int_to_little_endian(n, 4).hex())
```

### Chapter 4 Practice Coverage

After this chapter, you should be able to:

- Serialize and parse SEC public keys in compressed and uncompressed form.
- Encode and parse DER signatures with correct marker and length checks.
- Produce Base58Check strings and reject bad checksums.
- Convert integers to and from little-endian byte sequences.
- Explain why Bitcoin display formats and wire formats sometimes show hashes in opposite byte order.
