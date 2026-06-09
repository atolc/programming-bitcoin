<!-- order: 3 -->

## Validating Points on the Curve

For the curve $y^2 = x^3 + ax + b$, a point $(x, y)$ is valid only if its coordinates satisfy the equation exactly.

Let's try the curve $y^2 = x^3 + 5x + 7$ (similar to secp256k1 with $a=0$, $b=7$):

```python-sandbox
def on_curve(x, y, a=0, b=7):
    return y * y == x**3 + a * x + b

print("G = (2, 5) on curve?", on_curve(2, 5))
print("(3, 7) on curve?", on_curve(3, 7))
---
G = (2, 5) on curve? False
(3, 7) on curve? False
```

Let's find a valid point by trying values:

```python-sandbox
def on_curve(x, y, a=0, b=7):
    return y * y == x**3 + a * x + b

for x in range(1, 10):
    for y in range(0, 20):
        if on_curve(x, y):
            print(f"Valid point: ({x}, {y})")
---
Valid point: (3, 8)
Valid point: (3, 16)
Valid point: (5, 9)
Valid point: (5, 14)
```

> [!TIP]
> Two points with the same $x$ but different $y$ are additive inverses: their sum is the point at infinity.
