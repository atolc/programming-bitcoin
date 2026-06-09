<!-- order: 4 -->

## Suma de puntos distintos

Para sumar `P = (x1, y1)` y `Q = (x2, y2)` con `P != Q`, la pendiente es:

$$\lambda = \frac{y_2 - y_1}{x_2 - x_1}$$

Luego:
$$x_3 = \lambda^2 - x_1 - x_2$$
$$y_3 = \lambda(x_1 - x_3) - y_1$$

```python-sandbox
def add_points(p1, p2, a=0, b=7):
    x1, y1 = p1
    x2, y2 = p2
    if p1 == p2:
        return None  # usar duplicacion
    lam = (y2 - y1) / (x2 - x1)
    x3 = lam**2 - x1 - x2
    y3 = lam * (x1 - x3) - y1
    return (x3, y3)

P = (3, 8)
Q = (5, 9)
R = add_points(P, Q)
print(f"P + Q = {R}")
---
P + Q = (6.25, 10.75)
```
