<!-- order: 3 -->

## Modular Point Addition

The addition and doubling formulas are identical to those in the previous chapter, but each operation is done **modulo $p$**, and division is replaced by multiplication by the modular inverse.

```python-sandbox
p = 223
a, b = 0, 7

def inv(n):
    return pow(n, p - 2, p)

def add(P, Q):
    if P is None: return Q
    if Q is None: return P
    x1, y1 = P
    x2, y2 = Q
    if x1 == x2 and y1 != y2:
        return None
    if P != Q:
        lam = ((y2 - y1) * inv(x2 - x1)) % p
    else:
        lam = ((3*x1*x1 + a) * inv(2*y1)) % p
    x3 = (lam*lam - x1 - x2) % p
    y3 = (lam*(x1 - x3) - y1) % p
    return (x3, y3)

G = (170, 142)
P = add(G, G)
print("2G =", P)
```
