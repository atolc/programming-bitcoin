<!-- order: 11 -->

## Práctica Guiada Interactiva

Resuelve los siguientes ejercicios utilizando tus conocimientos teóricos antes de desplegar las respuestas.

### Ejercicio 1: Sumas y Restas en $F_{57}$
Resuelve las siguientes operaciones matemáticas:
1.  $44 +_f 33$
2.  $9 -_f 29$
3.  $17 +_f 42 +_f 49$
4.  $52 -_f 30 -_f 38$

<details>
<summary><b>Ver solución paso a paso del Ejercicio 1</b></summary>

Para resolver en $F_{57}$, realizamos la operación tradicional y al final aplicamos el módulo $\% 57$:

1.  **$44 + 33 = 77$**
    $$77 \pmod{57} = 20$$
2.  **$9 - 29 = -20$**
    $$-20 \pmod{57} = 37 \quad (\text{puesto que } -20 = -1 \cdot 57 + 37)$$
3.  **$17 + 42 + 49 = 108$**
    $$108 \pmod{57} = 51 \quad (\text{puesto que } 108 = 1 \cdot 57 + 51)$$
4.  **$52 - 30 - 38 = -16$**
    $$-16 \pmod{57} = 41 \quad (\text{puesto que } -16 = -1 \cdot 57 + 41)$$

Comprobemos esto con un Sandbox:

```python-sandbox
p = 57
print("1. 44 + 33 mod 57 =", (44 + 33) % p)
print("2. 9 - 29 mod 57 =", (9 - 29) % p)
print("3. 17 + 42 + 49 mod 57 =", (17 + 42 + 49) % p)
print("4. 52 - 30 - 38 mod 57 =", (52 - 30 - 38) % p)
```
</details>

---

### Ejercicio 2: Multiplicación y Exponenciación en $F_{97}$
Resuelve:
1.  $95 * 45 * 31$
2.  $17 * 13 * 19 * 44$
3.  $12^7 * 77^{49}$

<details>
<summary><b>Ver solución paso a paso del Ejercicio 2</b></summary>

1.  **$95 \cdot 45 \cdot 31 = 132525$**
    $$132525 \pmod{97} = 23$$
2.  **$17 \cdot 13 \cdot 19 \cdot 44 = 184756$**
    $$184756 \pmod{97} = 62$$
3.  **$12^7 \cdot 77^{49} \pmod{97}$**
    *   Podemos elevar cada término individual y luego multiplicarlos:
        $$
        \begin{aligned}
        12^7 \pmod{97} &= 77 \\
        77^{49} \pmod{97} &= 27 \\
        (77 \cdot 27) \pmod{97} &= 2079 \pmod{97} = 42
        \end{aligned}
        $$

Ejecutemos la validación:

```python-sandbox
p = 97
print("1. 95 * 45 * 31 mod 97 =", (95 * 45 * 31) % p)
print("2. 17 * 13 * 19 * 44 mod 97 =", (17 * 13 * 19 * 44) % p)

term1 = pow(12, 7, p)
term2 = pow(77, 49, p)
print("3. (12^7 * 77^49) mod 97 =", (term1 * term2) % p)
```
</details>

---

### Ejercicio 3: División y Exponentes Negativos en $F_{31}$
Resuelve:
1.  $3 / 24$
2.  $17^{-3}$
3.  $4^{-4} * 11$

<details>
<summary><b>Ver solución paso a paso del Ejercicio 3</b></summary>

1.  **$3 / 24 = 3 \cdot 24^{29} \pmod{31}$**
    $$24^{-1} \pmod{31} = 24^{29} \pmod{31} = 29$$
    $$3 \cdot 29 \pmod{31} = 87 \pmod{31} = 25$$
2.  **$17^{-3} \pmod{31}$**
    *   El exponente se reduce mod $30$:
        $$-3 \pmod{30} = 27$$
        $$17^{27} \pmod{31} = 15$$
3.  **$4^{-4} \cdot 11 \pmod{31}$**
    *   Reducimos $-4 \pmod{30} = 26$
        $$4^{26} \pmod{31} = 16$$
        $$16 \cdot 11 \pmod{31} = 176 \pmod{31} = 21$$

Verifiquemos en la consola:

```python-sandbox
p = 31
# 1. División
inv_24 = pow(24, p - 2, p)
print("1. 3 / 24 mod 31 =", (3 * inv_24) % p)

# 2. Exponente negativo
print("2. 17^-3 mod 31 =", pow(17, -3 % (p - 1), p))

# 3. Exponente negativo con multiplicación
inv_pot_4 = pow(4, -4 % (p - 1), p)
print("3. 4^-4 * 11 mod 31 =", (inv_pot_4 * 11) % p)
```
</details>

---
