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
```

La dificultad del problema del logaritmo discreto en curvas elípticas hace que conocer $k$ a partir de $kG$ sea computacionalmente inviable.

### Por qué importa double-and-add

La suma repetida es demasiado lenta cuando el escalar es una llave privada de 256 bits. Double-and-add usa la representación binaria de $k$, así que necesita como máximo una duplicación por bit y una suma por cada bit `1`.

Por ejemplo, $13P$ es:

$$13P = 8P + 4P + P$$

porque $13$ es `1101` en binario. Es la misma idea de la exponenciación rápida: construir potencias duplicando y sumar solo las piezas marcadas por los bits.

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

print("13P usa:", bits(13))
print("201P usa:", bits(201))
```
