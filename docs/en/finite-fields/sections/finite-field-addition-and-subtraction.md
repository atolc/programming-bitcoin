<!-- order: 5 -->

## Addition and Subtraction in $F_p$

In a finite field $F_p$, we define addition $+_f$ and subtraction $-_f$ by applying the normal integer operation and then computing the remainder modulo $p$.

$$
\begin{aligned}
a +_f b &= (a + b) \pmod p \\
a -_f b &= (a - b) \pmod p
\end{aligned}
$$

### Detailed examples in $F_{19}$:

*   **Normal addition:** $7 +_f 8$
    $$7 + 8 = 15 \implies 15 \pmod{19} = 15$$
*   **Wrap-around addition:** $11 +_f 17$
    $$11 + 17 = 28 \implies 28 \pmod{19} = 9 \quad (\text{since } 28 = 1 \cdot 19 + 9)$$
*   **Simple subtraction:** $11 -_f 9$
    $$11 - 9 = 2 \implies 2 \pmod{19} = 2$$
*   **Subtraction with a negative result:** $6 -_f 13$
    $$6 - 13 = -7 \implies -7 \pmod{19} = 12 \quad (\text{since } -7 = (-1) \cdot 19 + 12)$$

Let's see the behavior of these additions and subtractions in Python:

```python-sandbox
p = 19
# Wrap-around addition
suma = (11 + 17) % p
print(f"11 + 17 mod 19 = {suma}")

# Subtraction with a negative result
resta = (6 - 13) % p
print(f"6 - 13 mod 19 = {resta}")
---
11 + 17 mod 19 = 9
6 - 13 mod 19 = 12
```

---
