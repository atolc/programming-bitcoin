<!-- order: 4 -->

## secp256k1 with Small Numbers

Bitcoin uses an enormous prime, but the logic is the same over a small field. Let's simulate with $p = 223$:

```python-sandbox
p = 223
a = 0
b = 7

def on_curve(x, y):
    return (y * y - (x**3 + a * x + b)) % p == 0

G = (170, 142)
print("G on curve?", on_curve(*G))
```

Bitcoin's actual curve is **secp256k1**:

- $p = 2^{256} - 2^{32} - 977$
- $a = 0$, $b = 7$
- Generator point $G$ with fixed coordinates published in the standards

The generator has a large prime order $n$. That means:

$$nG = \mathcal{O}$$

and every private key is interpreted as an integer from $1$ to $n-1$.

```python-sandbox
P = 2**256 - 2**32 - 977
N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141
GX = 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798
GY = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8

print("field prime bits:", P.bit_length())
print("group order bits:", N.bit_length())
print("G on curve?", (GY * GY - (GX * GX * GX + 7)) % P == 0)
```
