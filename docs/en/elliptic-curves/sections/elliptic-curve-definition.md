<!-- order: 2 -->

## Elliptic Curve Definition

An elliptic curve over the reals has the form:

$$y^2 = x^3 + ax + b$$

Where $4a^3 + 27b^2 \neq 0$ (non-singularity condition).

Compared to a classic cubic $y = ax^3 + bx^2 + cx + d$, the $y^2$ term on the left makes the graph **symmetric with respect to the $x$-axis**: if $(x, y)$ is on the curve, so is $(x, -y)$.

In cryptography we do not use the continuous curve from the book's figure, but a version defined over a **finite field**. However, the geometric intuition for adding points comes from the real curve.

> [!TIP]
> Think of an elliptic curve as a set of points $(x, y)$ that satisfy the equation, plus a special point called the **point at infinity** ($\mathcal{O}$).

### What the Figures Are Teaching

The continuous graphs in the book are there to build geometric intuition:

- A line usually intersects a nonsingular cubic curve in three points.
- Because the curve is symmetric over the $x$-axis, reflecting the third intersection gives a stable addition rule.
- Some curves are connected and some are split into two visible pieces, but the same algebraic equation governs both.
- The condition $4a^3 + 27b^2 \neq 0$ prevents cusps and self-intersections. Without that condition, the point-addition law breaks down.

For Chapter 2, stay in the real-number picture long enough to understand slopes and reflections. In Chapter 3, the same formulas are moved into finite fields.
