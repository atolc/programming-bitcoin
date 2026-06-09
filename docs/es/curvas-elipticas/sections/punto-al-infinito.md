<!-- order: 6 -->

## El punto al infinito

El **punto al infinito** ($\mathcal{O}$) es el elemento neutro del grupo de puntos de la curva:

- $P + \mathcal{O} = P$
- $P + (-P) = \mathcal{O}$, donde $-P = (x, -y)$

Casos especiales al sumar:

| Situación | Resultado |
|-----------|-----------|
| $P + \mathcal{O}$ | $P$ |
| $P + (-P)$ | $\mathcal{O}$ |
| Recta vertical ($x_1 = x_2$, $y_1 \neq y_2$) | $\mathcal{O}$ |

En código representamos $\mathcal{O}$ como `None` o una instancia especial de `Point` con coordenadas `None`.

```python-sandbox
class Point:
  def __init__(self, x, y, a, b):
    self.x, self.y, self.a, self.b = x, y, a, b
    if x is not None and not self.on_curve():
      raise ValueError(f"({x}, {y}) no esta en la curva")

  def on_curve(self):
    if self.x is None:
      return True
    return self.y**2 == self.x**3 + self.a * self.x + self.b

  def __eq__(self, other):
    return self.x == other.x and self.y == other.y

  def __repr__(self):
    if self.x is None:
      return "Point(infinito)"
    return f"Point({self.x}, {self.y})"

O = Point(None, None, 0, 7)
P = Point(3, 8, 0, 7)
print(O)
print(P)
print("P == P?", P == P)
```
