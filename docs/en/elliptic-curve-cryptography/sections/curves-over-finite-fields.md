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
```

> [!TIP]
> The point at infinity is still the neutral element of the group, even though it has no $(x, y)$ coordinates in the plane.

### From Real Curves to Modular Curves

Over the reals, a line intersects a visible curve. Over $F_p$, there is no smooth line to draw, but the algebra still works because every coordinate operation is reduced modulo $p$.

The practical translation is:

- Replace each integer coordinate with a `FieldElement`.
- Replace division by multiplication with the modular inverse.
- Keep the same point-addition formulas from Chapter 2.
- Treat $\mathcal{O}$ as the identity, exactly as before.

This is the bridge from geometry to cryptography: finite fields make the set of possible points finite, while scalar multiplication remains easy in one direction and hard to reverse.
