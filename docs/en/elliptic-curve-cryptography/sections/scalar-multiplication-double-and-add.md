<!-- order: 5 -->

## Scalar Multiplication (Double-and-Add)

Multiplying a point $P$ by a scalar $k$ means adding $P$ to itself $k$ times: $kP = P + P + \cdots + P$.

The **double-and-add** algorithm walks through the bits of $k$:

```python-sandbox
p = 223
a, b = 0, 7

def inv(n): return pow(n, p-2, p)

def add(P, Q):
    if P is None: return Q
    if Q is None: return P
    x1,y1 = P; x2,y2 = Q
    if x1==x2 and y1!=y2: return None
    lam = ((y2-y1)*inv(x2-x1) if P!=Q else (3*x1*x1+a)*inv(2*y1)) % p
    x3 = (lam*lam - x1 - x2) % p
    y3 = (lam*(x1-x3) - y1) % p
    return (x3, y3)

def scalar_mult(k, P):
    acc = None
    addend = P
    while k:
        if k & 1:
            acc = add(acc, addend)
        addend = add(addend, addend)
        k >>= 1
    return acc

G = (170, 142)
print("5G =", scalar_mult(5, G))
```

The difficulty of the elliptic curve discrete logarithm problem makes it computationally infeasible to learn $k$ from $kG$.

### Why Double-and-Add Matters

Repeated addition is too slow when the scalar is a 256-bit private key. Double-and-add uses the binary representation of $k$, so it needs at most one doubling per bit and one addition for each `1` bit.

For example, $13P$ is:

$$13P = 8P + 4P + P$$

because $13$ is `1101` in binary. This is the same idea as fast exponentiation: build powers by doubling, then add only the pieces requested by the bits.

```python-sandbox
def bits(n):
    out = []
    power = 1
    while n:
        if n & 1:
            out.append(power)
        power *= 2
        n >>= 1
    return out

print("13P uses:", bits(13))
print("201P uses:", bits(201))
```
