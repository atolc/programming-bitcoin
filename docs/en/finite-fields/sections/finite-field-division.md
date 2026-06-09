<!-- order: 8 -->

## Division and Fermat's Little Theorem

Division in finite fields is the operation that confuses students the most.

In traditional integer arithmetic, we cannot divide exactly (for example, $2 / 7$ does not produce an integer). However, in a finite field, division must result in an element of the field.

To solve this, we recall the definition of division: **dividing is multiplying by the multiplicative inverse.**
$$\frac{a}{b} = a \cdot b^{-1}$$

What is $b^{-1}$? It is the element in the field such that:
$$b \cdot b^{-1} \equiv 1 \pmod p$$

For example, in $F_{19}$, if we want to solve $2 / 7$, we look for a number $x$ such that:
$$x \cdot 7 \equiv 2 \pmod{19}$$
We know that $3 \cdot 7 = 21 \equiv 2 \pmod{19}$. Therefore, $\frac{2}{7} = 3$.

### How do we calculate $b^{-1}$ without guessing?
We use **Fermat's Little Theorem**. This theorem states that for any prime $p$ and any integer $b \neq 0$:
$$b^{p-1} \equiv 1 \pmod p$$

If we multiply both sides by $b^{-1}$:
$$b^{p-2} \equiv b^{-1} \pmod p$$

This formula is magical! It tells us that the multiplicative inverse of $b$ is simply $b$ raised to the power $p-2$ in modular arithmetic.
Therefore, division is calculated as:
$$\frac{a}{b} = a \cdot b^{p-2} \pmod p$$

### Step-by-step example in $F_{19}$:
Let's calculate $2 / 7$:
$$2 / 7 = 2 \cdot 7^{19-2} \pmod{19} = 2 \cdot 7^{17} \pmod{19}$$
Using Fermat and reducing powers:
$$2 \cdot 7^{17} \pmod{19} = 3$$

Let's run the test in Python using `pow`:

```python-sandbox
# Division in finite fields using Fermat's theorem
a = 2
b = 7
p = 19

# Calculate the inverse of 7 mod 19, which is 7^(19-2) mod 19
inverso_b = pow(b, p - 2, p)
print(f"The inverse of 7 mod 19 is: {inverso_b}")

# Multiply a by the inverse of b
resultado = (a * inverso_b) % p
print(f"Result of 2 / 7 mod 19 is: {resultado}")
---
The inverse of 7 mod 19 is: 11
Result of 2 / 7 mod 19 is: 3
```

---
