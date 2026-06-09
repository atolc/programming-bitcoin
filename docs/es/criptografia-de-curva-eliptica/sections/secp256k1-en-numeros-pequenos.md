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
