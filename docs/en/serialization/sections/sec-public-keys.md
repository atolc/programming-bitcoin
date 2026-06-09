<!-- order: 3 -->

## SEC Public Keys (Compressed and Uncompressed)

The **SEC** format (*Standards for Efficient Cryptography*) serializes an elliptic curve point as a byte sequence.

### Uncompressed

Prefix `0x04` followed by the coordinates $x$ and $y$, each 32 bytes on secp256k1:

$$\text{SEC}_{\text{uncompressed}} = 0x04 \,\|\, x_{32} \,\|\, y_{32}$$

Total: **65 bytes**.

### Compressed

The curve is symmetric with respect to the $x$-axis: given $x$, there are only two possible values of $y$ (even or odd). The compressed format stores:

- `0x02` if $y$ is even
- `0x03` if $y$ is odd

followed by $x$ (32 bytes). Total: **33 bytes**.

```python-sandbox
# Simplified scheme (example coordinates)
x = bytes.fromhex("79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798")
y_even = True  # y is even in this example
prefix = b"\x02" if y_even else b"\x03"
sec_compressed = prefix + x
print(f"Compressed SEC: {len(sec_compressed)} bytes")
print(sec_compressed.hex())
---
Compressed SEC: 33 bytes
0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798
```

> [!TIP]
> Bitcoin has preferred compressed keys since version 0.6: they take half the space and reduce the size of transactions that reference them.
