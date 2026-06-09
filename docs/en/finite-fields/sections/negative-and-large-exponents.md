<!-- order: 9 -->

## Negative and Large Exponents

What does it mean to raise a number to a negative exponent in a finite field? For example, $a^{-3}$.

As in traditional mathematics, the negative sign denotes the inverse:
$$a^{-3} = (a^3)^{-1} = (a^{-1})^3$$

Thanks to Fermat's Little Theorem ($a^{p-1} \equiv 1 \pmod p$), we can add or subtract multiples of $p-1$ to the exponent without changing the final result. This gives us an extremely useful tool in code:

$$a^n \equiv a^{n \pmod{p-1}} \pmod p$$

This not only lets us calculate negative exponents, but also reduces astronomically large exponents to a manageable range.

### Example in $F_{13}$:
Let's calculate $7^{-3}$:
$$
\begin{aligned}
-3 \pmod{13 - 1} &= -3 \pmod{12} = 9 \\
7^{-3} \pmod{13} &= 7^9 \pmod{13} = 8
\end{aligned}
$$

Let's run this in Python:

```python-sandbox
# Negative exponent and modular reduction of the exponent
base = 7
exponente = -3
p = 13

# Reduce the exponent
exp_reducido = exponente % (p - 1)
print(f"Exponent -3 mod 12 = {exp_reducido}")

# Operate with the reduced exponent
resultado = pow(base, exp_reducido, p)
print(f"7^-3 mod 13 = {resultado}")
```

---
