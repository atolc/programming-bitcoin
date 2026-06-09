<!-- order: 2 -->

## Curves over Finite Fields

Over a prime $p$, the curve equation is evaluated with modular arithmetic:

$$y^2 \equiv x^3 + ax + b \pmod{p}$$

A point $(x, y)$ is valid if the congruence holds. There is no longer a continuous curve: only a **finite** set of points that satisfy the equation.

```python-sandbox
p = 223
a, b = 0, 7

def on_curve(x, y):
    return (y*y - (x**3 + a*x + b)) % p == 0

count = sum(1 for x in range(p) for y in range(p) if on_curve(x, y))
print(f"Points on the curve (excluding infinity): {count}")
---
Points on the curve (excluding infinity): 222
```

> [!TIP]
> The point at infinity is still the neutral element of the group, even though it has no $(x, y)$ coordinates in the plane.
