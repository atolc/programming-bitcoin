<!-- order: 4 -->

## secp256k1 en números pequeños

Bitcoin usa un primo enorme, pero la lógica es la misma sobre un campo pequeño. Simulemos con $p = 223$:

```python-sandbox
p = 223
a = 0
b = 7

def on_curve(x, y):
    return (y * y - (x**3 + a * x + b)) % p == 0

G = (170, 142)
print("G en curva?", on_curve(*G))
```

La curva real de Bitcoin es **secp256k1**:

- $p = 2^{256} - 2^{32} - 977$
- $a = 0$, $b = 7$
- Punto generador $G$ con coordenadas fijas publicadas en los estándares

El generador tiene un orden primo grande $n$. Eso significa:

$$nG = \mathcal{O}$$

y toda llave privada se interpreta como un entero entre $1$ y $n-1$.

```python-sandbox
P = 2**256 - 2**32 - 977
N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141
GX = 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798
GY = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8

print("bits del primo del campo:", P.bit_length())
print("bits del orden del grupo:", N.bit_length())
print("G en la curva?", (GY * GY - (GX * GX * GX + 7)) % P == 0)
```
