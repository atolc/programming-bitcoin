<!-- order: 9 -->

## Exponentes Negativos y Grandes

¿Qué significa elevar un número a un exponente negativo en un campo finito? Por ejemplo, $a^{-3}$.

Al igual que en la matemática tradicional, el signo negativo denota el inverso:
$$a^{-3} = (a^3)^{-1} = (a^{-1})^3$$

Gracias al Pequeño Teorema de Fermat ($a^{p-1} \equiv 1 \pmod p$), podemos sumar o restar múltiplos de $p-1$ al exponente sin alterar el resultado final. Esto nos da una herramienta extremadamente útil en código:

$$a^n \equiv a^{n \pmod{p-1}} \pmod p$$

Esto no solo nos permite calcular exponentes negativos, sino también reducir exponentes de tamaño astronómico a un rango manejable.

### Ejemplo en $F_{13}$:
Calculemos $7^{-3}$:
$$
\begin{aligned}
-3 \pmod{13 - 1} &= -3 \pmod{12} = 9 \\
7^{-3} \pmod{13} &= 7^9 \pmod{13} = 8
\end{aligned}
$$

Ejecutemos en Python:

```python-sandbox
# Exponente negativo y reducción modular del exponente
base = 7
exponente = -3
p = 13

# Reducimos el exponente
exp_reducido = exponente % (p - 1)
print(f"Exponente -3 mod 12 = {exp_reducido}")

# Operamos con el exponente reducido
resultado = pow(base, exp_reducido, p)
print(f"7^-3 mod 13 = {resultado}")
---
Exponente -3 mod 12 = 9
7^-3 mod 13 = 8
```

---
