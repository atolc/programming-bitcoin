<!-- order: 3 -->

## Definition and Properties of a Finite Field

Mathematically, a **finite field** is a finite set of elements together with two operations called *addition* ($+$) and *multiplication* ($*$).

For this set to be considered a field, it must rigorously satisfy the following properties:

*   **Closure:** If $a$ and $b$ belong to the field, then $a + b$ and $a * b$ also belong to the field. This means operations cannot "escape" the set.
*   **Additive Identity:** There exists an element $0$ in the field such that $a + 0 = a$.
*   **Multiplicative Identity:** There exists an element $1$ in the field such that $a * 1 = a$.
*   **Additive Inverse:** For each element $a$ in the field, there exists another element $-a$ such that $a + (-a) = 0$.
*   **Multiplicative Inverse:** For each element $a \neq 0$ in the field, there exists another element $a^{-1}$ such that $a * a^{-1} = 1$.

### Why do we need to change the mathematical rules?
Imagine the simple set $\{0, 1, 2\}$. If we use traditional integer addition:
$$1 + 2 = 3$$
Since $3$ is not in our set, the system is not closed and therefore **is not a field**. To fix this and keep results within our closed range, we turn to the modulus.

---
