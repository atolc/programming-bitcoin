<!-- order: 5 -->

## Duplicacion de un punto

Cuando `P = Q`, usamos la pendiente de la tangente:

$$\lambda = \frac{3x_1^2 + a}{2y_1}$$

```python-sandbox
def double_point(p, a=0):
    x, y = p
    lam = (3 * x**2 + a) / (2 * y)
    x3 = lam**2 - 2 * x
    y3 = lam * (x - x3) - y
    return (x3, y3)

P = (3, 8)
R = double_point(P)
print(f"2P = {R}")
---
2P = (1.5625, 5.875)
```
