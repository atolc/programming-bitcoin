<!-- order: 6 -->

## Sección 5: Multiplicación y Exponenciación

La multiplicación en un campo finito también requiere envolver el resultado mediante el módulo $p$:

$$a *_f b = (a \cdot b) \pmod p$$

### Ejemplos en $F_{19}$:
*   **Multiplicación básica:** $5 *_f 3$
    $$5 \cdot 3 = 15 \implies 15 \pmod{19} = 15$$
*   **Multiplicación con envoltura:** $8 *_f 17$
    $$8 \cdot 17 = 136$$
    $$136 \pmod{19} = 3 \quad (\text{ya que } 136 = 7 \cdot 19 + 3)$$

### Exponenciación
La exponenciación es la multiplicación repetida de un elemento por sí mismo:
$$a^n = \underbrace{a \cdot a \cdot \dots \cdot a}_{n \text{ veces}}$$

En $F_{19}$, calculemos $7^3$:
$$7^3 = 343 \implies 343 \pmod{19} = 1 \quad (\text{ya que } 343 = 18 \cdot 19 + 1)$$

> [!TIP]  
> Al programar exponenciaciones modulares en Python, **nunca** eleves primero y apliques módulo después (ej: `(7 ** 3) % 19`), porque si los números son muy grandes (como en Bitcoin, donde los números tienen 256 bits), la memoria colapsará. Usa la función integrada `pow(base, exponente, modulo)`, la cual calcula el residuo en cada paso intermedio del algoritmo de exponenciación binaria.

Ejecutemos este concepto para verificar:

```python-sandbox
# Uso correcto de pow para exponenciación modular
base = 7
exponente = 3
primo = 19

resultado = pow(base, exponente, primo)
print(f"7^3 mod 19 = {resultado}")
---
7^3 mod 19 = 1
```

---
