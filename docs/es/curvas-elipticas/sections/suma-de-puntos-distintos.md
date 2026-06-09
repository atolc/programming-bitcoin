<!-- order: 4 -->

## Suma de puntos distintos

Para sumar $P = (x_1, y_1)$ y $Q = (x_2, y_2)$ con $P \neq Q$ y $x_1 \neq x_2$, trazamos la recta que pasa por ambos y la intersectamos de nuevo con la curva. El resultado es el simétrico del tercer punto de intersección.

La pendiente es:

$$\lambda = \frac{y_2 - y_1}{x_2 - x_1}$$

Luego:

$$x_3 = \lambda^2 - x_1 - x_2$$
$$y_3 = \lambda(x_1 - x_3) - y_1$$

```python-sandbox
def add_points(p1, p2, a=0, b=7):
    x1, y1 = p1
    x2, y2 = p2
    if p1 == p2:
        return None
    lam = (y2 - y1) / (x2 - x1)
    x3 = lam**2 - x1 - x2
    y3 = lam * (x1 - x3) - y1
    return (x3, y3)

P = (3, 8)
Q = (5, 9)
R = add_points(P, Q)
print(f"P + Q = {R}")
```

### Todos los casos con puntos distintos

Para dos puntos distintos en la misma curva hay tres casos importantes:

- Si uno de los puntos es $\mathcal{O}$, se devuelve el otro punto sin cambios.
- Si $x_1 = x_2$ y $y_1 = -y_2$, la línea es vertical y la suma es $\mathcal{O}$.
- Si $x_1 \neq x_2$, se usa la fórmula de la pendiente.

```python-sandbox
def add_distinct(p1, p2):
    if p1 is None:
        return p2
    if p2 is None:
        return p1
    x1, y1 = p1
    x2, y2 = p2
    if x1 == x2 and y1 != y2:
        return None
    s = (y2 - y1) / (x2 - x1)
    x3 = s**2 - x1 - x2
    y3 = s * (x1 - x3) - y1
    return (x3, y3)

print(add_distinct(None, (3, 7)))
print(add_distinct((2, 5), (2, -5)))
```

El libro separa la geometría del código para que los casos especiales sean visibles. Una clase `Point` completa debe representarlos todos.
