<!-- order: 5 -->

## Point Doubling

When $P = Q$, the tangent line to the curve at $P$ replaces the secant. The slope of the tangent is:

$$\lambda = \frac{3x_1^2 + a}{2y_1}$$

The formulas for $x_3$ and $y_3$ are the same as in point addition.

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
