<!-- order: 4 -->

## Modular Arithmetic (The Wrap-Around)

The main tool for achieving mathematical closure is **modular arithmetic** (modulo).

The expression $a \pmod p$ is read as "$a$ modulo $p$" and represents the **remainder** when dividing $a$ by $p$. This remainder will always be an integer greater than or equal to $0$ and strictly less than $p$ ($0 \le \text{remainder} < p$).

Mathematically, $a \pmod p = r$ means there exists an integer quotient $q$ such that:
$$a = q \cdot p + r$$

### Step-by-step examples:

1.  **Positive modulus:** $7 \pmod 3 = 1$
    *   *Explanation:* $7 = 2 \cdot 3 + 1$. The quotient is $2$ and the remainder is $1$.
2.  **Modulus with larger numbers:** $1747 \pmod{241} = 60$
    *   *Explanation:* $1747 = 7 \cdot 241 + 60$. The quotient is $7$ and the remainder is $60$.
3.  **Negative modulus:** $-27 \pmod{13} = 12$
    *   *Explanation:* We want the remainder to be positive. We divide downward: $-27 = (-3) \cdot 13 + 12$. The quotient is $-3$ and the remainder is $12$.

### The clock analogy
An intuitive way to understand the modulus is to think of the hours on a 12-hour clock.
*   If it is 3 o'clock and we add 47 hours, we can calculate the result with modulus 12:
    $$(3 + 47) \pmod{12} = 50 \pmod{12} = 2 \text{ (2 o'clock)}$$
*   Similarly going backward: if it is 3 o'clock and we go back 16 hours:
    $$(3 - 16) \pmod{12} = -13 \pmod{12} = 11 \text{ (11 o'clock)}$$

Let's try this concept by running the following interactive Python code:

```python-sandbox
# Modulo in Python
print("Simple modulo (7 % 3):", 7 % 3)
print("Large modulo (1747 % 241):", 1747 % 241)
print("Negative modulo (-27 % 13):", -27 % 13)
```

### Finite Field Notation
If the field has order $p$ (where $p$ is a prime number), its elements are:
$$F_p = \{0, 1, 2, \dots, p - 1\}$$

For example, the elements of the field $F_{11}$ are:
$$F_{11} = \{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}$$

> [!IMPORTANT]  
> An integer like $7$ does not exist floating independently in a vacuum; it belongs to a specific field. For example, $7 \in F_{11}$ is not equal to and cannot be operated on directly with $7 \in F_{17}$. They belong to fields with different rules and orders.

---
