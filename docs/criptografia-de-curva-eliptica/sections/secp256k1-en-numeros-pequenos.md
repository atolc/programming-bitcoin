<!-- order: 3 -->

## secp256k1 en números pequeños

Bitcoin usa un primo enorme, pero la lógica es la misma sobre un campo pequeño. Simulemos con `p = 223`:

```python-sandbox
p = 223
a = 0
b = 7

def on_curve(x, y):
    return (y * y - (x**3 + a * x + b)) % p == 0

G = (170, 142)
print("G en curva?", on_curve(*G))
---
G en curva? True
```
