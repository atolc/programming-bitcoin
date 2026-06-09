<!-- order: 7 -->

## Sección 6: ¿Por qué el Orden debe ser un Número Primo?

La razón por la cual los campos finitos que usa Bitcoin (como el campo de la curva `secp256k1`) tienen un orden primo $p$ es de suma importancia. **Si el orden del campo es primo, todos los elementos excepto el cero tienen un inverso multiplicativo.** Esto es lo que permite que la división sea posible y única.

Si tomamos un elemento no nulo $k$ de nuestro campo $F_p$ (con $p$ primo) y multiplicamos cada uno de los elementos del campo por $k$:
$$\{k \cdot 0, k \cdot 1, k \cdot 2, \dots, k \cdot (p-1)\} \pmod p$$
El resultado de este conjunto será exactamente el conjunto original $\{0, 1, 2, \dots, p-1\}$ reordenado. No se pierde ningún elemento.

### ¿Qué pasa si el orden del campo es compuesto?
Tomemos el módulo 12 (compuesto). Si multiplicamos todos los números por 3, obtenemos:
$$
\begin{aligned}
3 \cdot 0 \pmod{12} &= 0 \\
3 \cdot 1 \pmod{12} &= 3 \\
3 \cdot 2 \pmod{12} &= 6 \\
3 \cdot 3 \pmod{12} &= 9 \\
3 \cdot 4 \pmod{12} &= 0 \quad (\text{¡Se repite el 0 y colapsa!})
\end{aligned}
$$
El conjunto resultante bajo multiplicación por 3 es $\{0, 3, 6, 9\}$, lo cual es un subconjunto incompleto. Esto rompe la simetría matemática y hace imposible definir un inverso multiplicativo único para el 3.

---
