<!-- order: 8 -->

## Sección 7: División y el Pequeño Teorema de Fermat

La división en campos finitos es la operación que más confunde a los estudiantes.

En la aritmética de números enteros tradicionales, no podemos dividir de manera exacta (por ejemplo, $2 / 7$ no produce un entero). Sin embargo, en un campo finito la división debe resultar en un elemento del campo.

Para resolver esto, recordamos la definición de división: **dividir es multiplicar por el inverso multiplicativo.**
$$\frac{a}{b} = a \cdot b^{-1}$$

¿Qué es $b^{-1}$? Es el elemento en el campo tal que:
$$b \cdot b^{-1} \equiv 1 \pmod p$$

Por ejemplo, en $F_{19}$, si queremos resolver $2 / 7$, buscamos un número $x$ tal que:
$$x \cdot 7 \equiv 2 \pmod{19}$$
Sabemos que $3 \cdot 7 = 21 \equiv 2 \pmod{19}$. Por lo tanto, $\frac{2}{7} = 3$.

### ¿Cómo calculamos $b^{-1}$ sin adivinar?
Utilizamos el **Pequeño Teorema de Fermat**. Este teorema establece que para cualquier primo $p$ y cualquier entero $b \neq 0$:
$$b^{p-1} \equiv 1 \pmod p$$

Si multiplicamos ambos lados por $b^{-1}$:
$$b^{p-2} \equiv b^{-1} \pmod p$$

¡Esta fórmula es mágica! Nos dice que el inverso multiplicativo de $b$ es simplemente $b$ elevado a la potencia $p-2$ en aritmética modular.
Por lo tanto, la división se calcula como:
$$\frac{a}{b} = a \cdot b^{p-2} \pmod p$$

### Ejemplo paso a paso en $F_{19}$:
Calculemos $2 / 7$:
$$2 / 7 = 2 \cdot 7^{19-2} \pmod{19} = 2 \cdot 7^{17} \pmod{19}$$
Usando Fermat y reduciendo potencias:
$$2 \cdot 7^{17} \pmod{19} = 3$$

Ejecutemos la prueba en Python utilizando `pow`:

```python-sandbox
# División en campos finitos mediante el teorema de Fermat
a = 2
b = 7
p = 19

# Calculamos el inverso de 7 mod 19, que es 7^(19-2) mod 19
inverso_b = pow(b, p - 2, p)
print(f"El inverso de 7 mod 19 es: {inverso_b}")

# Multiplicamos a por el inverso de b
resultado = (a * inverso_b) % p
print(f"Resultado de 2 / 7 mod 19 es: {resultado}")
---
El inverso de 7 mod 19 es: 11
Resultado de 2 / 7 mod 19 es: 3
```

---
