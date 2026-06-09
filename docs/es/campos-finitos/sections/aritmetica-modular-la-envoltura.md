<!-- order: 4 -->

## Aritmética Modular (La Envoltura)

La herramienta principal para lograr la cerradura matemática es la **aritmética modular** (módulo).

La expresión $a \pmod p$ se lee como "$a$ módulo $p$" y representa el **residuo** o resto al dividir $a$ entre $p$. Este residuo siempre será un número entero mayor o igual a $0$ y estrictamente menor que $p$ ($0 \le \text{residuo} < p$).

Matemáticamente, $a \pmod p = r$ significa que existe un cociente entero $q$ tal que:
$$a = q \cdot p + r$$

### Ejemplos paso a paso:

1.  **Módulo positivo:** $7 \pmod 3 = 1$
    *   *Explicación:* $7 = 2 \cdot 3 + 1$. El cociente es $2$ y el resto es $1$.
2.  **Módulo con números más grandes:** $1747 \pmod{241} = 60$
    *   *Explicación:* $1747 = 7 \cdot 241 + 60$. El cociente es $7$ y el resto es $60$.
3.  **Módulo negativo:** $-27 \pmod{13} = 12$
    *   *Explicación:* Queremos que el residuo sea positivo. Dividimos hacia abajo: $-27 = (-3) \cdot 13 + 12$. El cociente es $-3$ y el resto es $12$.

### La analogía del reloj
Una forma intuitiva de comprender el módulo es pensar en las horas de un reloj de 12 horas.
*   Si son las 3 y le sumamos 47 horas, podemos calcular el resultado con módulo 12:
    $$(3 + 47) \pmod{12} = 50 \pmod{12} = 2 \text{ (las 2 en punto)}$$
*   De igual manera hacia atrás: si son las 3 y retrocedemos 16 horas:
    $$(3 - 16) \pmod{12} = -13 \pmod{12} = 11 \text{ (las 11 en punto)}$$

Probemos este concepto ejecutando el siguiente código interactivo en Python:

```python-sandbox
# Módulos en Python
print("Módulo simple (7 % 3):", 7 % 3)
print("Módulo grande (1747 % 241):", 1747 % 241)
print("Módulo negativo (-27 % 13):", -27 % 13)
```

### Notación de Campos Finitos
Si el campo tiene orden $p$ (donde $p$ es un número primo), sus elementos son:
$$F_p = \{0, 1, 2, \dots, p - 1\}$$

Por ejemplo, los elementos del campo $F_{11}$ son:
$$F_{11} = \{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}$$

> [!IMPORTANT]  
> Un número entero como $7$ no existe flotando de manera independiente en el vacío; pertenece a un campo específico. Por ejemplo, $7 \in F_{11}$ no es igual y no se puede operar directamente con $7 \in F_{17}$. Pertenecen a campos con reglas y órdenes distintos.

---
