<!-- order: 3 -->

## Validar puntos en la curva

Para la curva $y^2 = x^3 + ax + b$, un punto $(x, y)$ es válido solo si sus coordenadas satisfacen la ecuación exactamente.

Probemos con la curva $y^2 = x^3 + 5x + 7$ (similar a secp256k1 con $a=0$, $b=7$):

```python-sandbox
def on_curve(x, y, a=0, b=7):
    return y * y == x**3 + a * x + b

print("G = (2, 5) en curva?", on_curve(2, 5))
print("(3, 7) en curva?", on_curve(3, 7))
---
G = (2, 5) en curva? False
(3, 7) en curva? False
```

Encontremos un punto válido probando valores:

```python-sandbox
def on_curve(x, y, a=0, b=7):
    return y * y == x**3 + a * x + b

for x in range(1, 10):
    for y in range(0, 20):
        if on_curve(x, y):
            print(f"Punto valido: ({x}, {y})")
---
Punto valido: (3, 8)
Punto valido: (3, 16)
Punto valido: (5, 9)
Punto valido: (5, 14)
```

> [!TIP]
> Dos puntos con la misma $x$ pero $y$ distintos son inversos aditivos: su suma es el punto al infinito.
