<!-- order: 5 -->

## Duplicación de un punto

Cuando $P = Q$, la recta tangente a la curva en $P$ reemplaza a la secante. La pendiente de la tangente es:

$$\lambda = \frac{3x_1^2 + a}{2y_1}$$

Las fórmulas para $x_3$ e $y_3$ son las mismas que en la suma de puntos distintos.

```python-sandbox
def double_point(p, a=0, b=7):
    x1, y1 = p
    lam = (3 * x1**2 + a) / (2 * y1)
    x3 = lam**2 - 2 * x1
    y3 = lam * (x1 - x3) - y1
    return (x3, y3)

P = (3, 8)
R = double_point(P)
print(f"2P = {R}")
```
