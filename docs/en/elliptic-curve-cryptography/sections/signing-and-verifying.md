<!-- order: 7 -->

## Signing and Verifying (ECDSA)

ECDSA produces a signature $(r, s)$ over a hash of the message $z$:

1. Choose a random $k$ and compute $kG = (x, y)$; take $r = x \bmod n$ ($n$ is the group order).
2. Compute $s = k^{-1}(z + re) \bmod n$, where $e$ is the private key.
3. The signature is the pair $(r, s)$.

To verify, the recipient checks that the ECDSA equation holds using the public key.

```python-sandbox
# Simplified scheme (without the real curve)
z = 0xdeadbeef  # hash of the message
k = 12345
r = 99   # x of kG mod n
s = 42   # k^-1 (z + r*priv) mod n
print(f"Signature: r={r}, s={s}")
```

> [!TIP]
> The nonce $k$ must **never** be reused or be predictable. A repeated $k$ leaks the private key.
