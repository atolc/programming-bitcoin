<!-- order: 4 -->

## Multiplicación escalar (double-and-add)

Multiplicar un punto por un escalar `k` significa sumar `P` consigo mismo `k` veces. El algoritmo double-and-add es eficiente:

```python-sandbox
def scalar_mult(k, point, p, a=0):
    current = None
    result = None
    addend = point
    while k:
        if k & 1:
            result = addend if result is None else add_points(result, addend, p, a)
        addend = double_point(addend, p, a)
        k >>= 1
    return result

def add_points(p1, p2, p, a=0):
    if p1 is None: return p2
    if p2 is None: return p1
    x1, y1 = p1
    x2, y2 = p2
    if x1 == x2 and y1 != y2:
        return None
    if p1 == p2:
        lam = (3 * x1 * x1 + a) * pow(2 * y1, p - 2, p) % p
    else:
        lam = (y2 - y1) * pow(x2 - x1, p - 2, p) % p
    x3 = (lam * lam - x1 - x2) % p
    y3 = (lam * (x1 - x3) - y1) % p
    return (x3, y3)

def double_point(p, p_mod, a=0):
    return add_points(p, p, p_mod, a)

p = 223
G = (170, 142)
priv = 7
pub = scalar_mult(priv, G, p)
print(f"Llave privada: {priv}")
print(f"Llave publica (7*G): {pub}")
---
Llave privada: 7
Llave publica (7*G): (49, 71)
```
