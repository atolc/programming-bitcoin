<!-- order: 4 -->

## Point Addition

To add $P = (x_1, y_1)$ and $Q = (x_2, y_2)$ with $P \neq Q$ and $x_1 \neq x_2$, we draw the line through both points and intersect it again with the curve. The result is the reflection of the third intersection point.

The slope is:

$$\lambda = \frac{y_2 - y_1}{x_2 - x_1}$$

Then:

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

### All Distinct-Point Cases

For two different points on the same curve, there are three important cases:

- If one point is $\mathcal{O}$, the other point is returned unchanged.
- If $x_1 = x_2$ and $y_1 = -y_2$, the line is vertical and the sum is $\mathcal{O}$.
- If $x_1 \neq x_2$, use the slope formula above.

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

The book separates the geometry from the code so the special cases are visible. A production `Point` class still has to encode all of them.
