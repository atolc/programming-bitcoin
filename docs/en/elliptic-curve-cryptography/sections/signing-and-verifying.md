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

### Verification Equation

Verification rearranges the signature so the verifier can compute a point using only public data:

$$u = z / s \pmod{n}$$
$$v = r / s \pmod{n}$$
$$R = uG + vP$$

The signature is valid when the $x$ coordinate of $R$ is congruent to $r$ modulo $n$.

```python-sandbox
def inv(n, order):
    return pow(n, order - 2, order)

order = 223
z = 17
r = 42
s = 99
u = z * inv(s, order) % order
v = r * inv(s, order) % order
print("u =", u)
print("v =", v)
print("real verification uses: u*G + v*PublicKey")
```

### Chapter 3 Practice Coverage

You should now be able to:

- Check whether finite-field points satisfy $y^2 = x^3 + 7$.
- Add and double points using modular inverses.
- Explain why scalar multiplication is fast but the discrete logarithm is hard.
- Describe secp256k1's field prime, generator point, and group order.
- Convert a message digest into the integer $z$ used by ECDSA.
- Describe signing and verification without needing the private key during verification.
