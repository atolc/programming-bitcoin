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
```

> [!TIP]
> Bitcoin has preferred compressed keys since version 0.6: they take half the space and reduce the size of transactions that reference them.

### Serialization and Parsing

Serialization turns a point into bytes. Parsing reverses the process. For uncompressed SEC, both coordinates are present. For compressed SEC, the missing $y$ coordinate is recovered by solving:

$$y^2 = x^3 + 7 \pmod{p}$$

Because secp256k1's field prime satisfies $p \bmod 4 = 3$, a square root can be computed with:

$$y = \alpha^{(p+1)/4} \pmod{p}$$

where $\alpha = x^3 + 7$.

```python-sandbox
P = 2**256 - 2**32 - 977

def sec_uncompressed(x, y):
    return b"\x04" + x.to_bytes(32, "big") + y.to_bytes(32, "big")

def sec_compressed(x, y):
    prefix = b"\x02" if y % 2 == 0 else b"\x03"
    return prefix + x.to_bytes(32, "big")

def parse_compressed(sec):
    prefix = sec[0]
    x = int.from_bytes(sec[1:], "big")
    alpha = (pow(x, 3, P) + 7) % P
    beta = pow(alpha, (P + 1) // 4, P)
    even_beta = beta if beta % 2 == 0 else P - beta
    odd_beta = P - even_beta
    y = even_beta if prefix == 2 else odd_beta
    return x, y

gx = int("79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", 16)
gy = int("483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", 16)
compressed = sec_compressed(gx, gy)
print(compressed.hex())
print(parse_compressed(compressed)[1] == gy)
```
