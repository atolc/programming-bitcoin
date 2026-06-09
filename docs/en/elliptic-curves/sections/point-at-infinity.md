<!-- order: 6 -->

## The Point at Infinity

The **point at infinity** ($\mathcal{O}$) is the neutral element of the curve's point group:

- $P + \mathcal{O} = P$
- $P + (-P) = \mathcal{O}$, where $-P = (x, -y)$

Special cases when adding:

| Situation | Result |
|-----------|-----------|
| $P + \mathcal{O}$ | $P$ |
| $P + (-P)$ | $\mathcal{O}$ |
| Vertical line ($x_1 = x_2$, $y_1 \neq y_2$) | $\mathcal{O}$ |

In code we represent $\mathcal{O}$ as `None` or a special `Point` instance with `None` coordinates.

```python-sandbox
class Point:
  def __init__(self, x, y, a, b):
    self.x, self.y, self.a, self.b = x, y, a, b
    if x is not None and not self.on_curve():
      raise ValueError(f"({x}, {y}) is not on the curve")

  def on_curve(self):
    if self.x is None:
      return True
    return self.y**2 == self.x**3 + self.a * self.x + self.b

  def __eq__(self, other):
    return self.x == other.x and self.y == other.y

  def __repr__(self):
    if self.x is None:
      return "Point(infinity)"
    return f"Point({self.x}, {self.y})"

O = Point(None, None, 5, 7)
P = Point(-1, -1, 5, 7)
print(O)
print(P)
print("P == P?", P == P)
```
