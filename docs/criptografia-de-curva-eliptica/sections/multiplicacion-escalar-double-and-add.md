<!-- order: 5 -->

## Multiplicación escalar (double-and-add)

Multiplicar un punto $P$ por un escalar $k$ significa sumar $P$ consigo mismo $k$ veces: $kP = P + P + \cdots + P$.

El algoritmo **double-and-add** recorre los bits de $k$:

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
---
5G = (106, 66)
```

La dificultad del problema del logaritmo discreto en curvas elípticas hace que conocer $k$ a partir de $kG$ sea computacionalmente inviable.
