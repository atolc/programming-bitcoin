<!-- order: 5 -->

## Suma y Resta en $F_p$

En un campo finito $F_p$, definimos la suma $+_f$ y la resta $-_f$ aplicando la operación normal en enteros y luego calculando el residuo módulo $p$.

$$
\begin{aligned}
a +_f b &= (a + b) \pmod p \\
a -_f b &= (a - b) \pmod p
\end{aligned}
$$

### Ejemplos detallados en $F_{19}$:

*   **Suma normal:** $7 +_f 8$
    $$7 + 8 = 15 \implies 15 \pmod{19} = 15$$
*   **Suma que envuelve (Wrap-around):** $11 +_f 17$
    $$11 + 17 = 28 \implies 28 \pmod{19} = 9 \quad (\text{ya que } 28 = 1 \cdot 19 + 9)$$
*   **Resta simple:** $11 -_f 9$
    $$11 - 9 = 2 \implies 2 \pmod{19} = 2$$
*   **Resta con resultado negativo:** $6 -_f 13$
    $$6 - 13 = -7 \implies -7 \pmod{19} = 12 \quad (\text{ya que } -7 = (-1) \cdot 19 + 12)$$

Veamos el comportamiento de estas sumas y restas en Python:

```python-sandbox
p = 19
# Suma que envuelve
suma = (11 + 17) % p
print(f"11 + 17 mod 19 = {suma}")

# Resta con resultado negativo
resta = (6 - 13) % p
print(f"6 - 13 mod 19 = {resta}")
---
11 + 17 mod 19 = 9
6 - 13 mod 19 = 12
```

---
