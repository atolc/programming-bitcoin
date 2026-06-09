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

### The Vertical Tangent Exception

If $y_1 = 0$, the tangent line is vertical. In that case the doubled point is the point at infinity:

$$2P = \mathcal{O}$$

```python-sandbox
def double_with_exception(p, a=0):
    x1, y1 = p
    if y1 == 0:
        return None
    s = (3 * x1**2 + a) / (2 * y1)
    x3 = s**2 - 2 * x1
    y3 = s * (x1 - x3) - y1
    return (x3, y3)

print("vertical tangent:", double_with_exception((4, 0)))
```

This is the final real-number special case that the Chapter 2 `Point` class needs before the same structure is reused over finite fields.
