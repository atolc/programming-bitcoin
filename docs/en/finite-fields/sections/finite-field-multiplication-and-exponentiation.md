<!-- order: 6 -->

## Multiplication and Exponentiation

Multiplication in a finite field also requires wrapping the result using modulus $p$:

$$a *_f b = (a \cdot b) \pmod p$$

### Examples in $F_{19}$:
*   **Basic multiplication:** $5 *_f 3$
    $$5 \cdot 3 = 15 \implies 15 \pmod{19} = 15$$
*   **Wrap-around multiplication:** $8 *_f 17$
    $$8 \cdot 17 = 136$$
    $$136 \pmod{19} = 3 \quad (\text{since } 136 = 7 \cdot 19 + 3)$$

### Exponentiation
Exponentiation is the repeated multiplication of an element by itself:
$$a^n = \underbrace{a \cdot a \cdot \dots \cdot a}_{n \text{ times}}$$

In $F_{19}$, let's calculate $7^3$:
$$7^3 = 343 \implies 343 \pmod{19} = 1 \quad (\text{since } 343 = 18 \cdot 19 + 1)$$

> [!TIP]  
> When programming modular exponentiation in Python, **never** raise to a power first and apply the modulus afterward (e.g., `(7 ** 3) % 19`), because if the numbers are very large (as in Bitcoin, where numbers are 256 bits), memory will collapse. Use the built-in `pow(base, exponent, modulus)` function, which computes the remainder at each intermediate step of the binary exponentiation algorithm.

Let's run this concept to verify:

```python-sandbox
# Correct use of pow for modular exponentiation
base = 7
exponente = 3
primo = 19

resultado = pow(base, exponente, primo)
print(f"7^3 mod 19 = {resultado}")
---
7^3 mod 19 = 1
```

---
