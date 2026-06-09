<!-- order: 2 -->

## Curvas sobre campos finitos

Sobre un primo $p$, la ecuación de la curva se evalúa con aritmética modular:

$$y^2 \equiv x^3 + ax + b \pmod{p}$$

Un punto $(x, y)$ es válido si la congruencia se cumple. Ya no hay una curva continua: solo un conjunto **finito** de puntos que satisfacen la ecuación.

```python-sandbox
p = 223
a, b = 0, 7

def on_curve(x, y):
    return (y*y - (x**3 + a*x + b)) % p == 0

count = sum(1 for x in range(p) for y in range(p) if on_curve(x, y))
print(f"Puntos en la curva (sin infinito): {count}")
```

> [!TIP]
> El punto al infinito sigue siendo el neutro del grupo, aunque no tenga coordenadas $(x, y)$ en el plano.

### De curvas reales a curvas modulares

Sobre los reales, una línea intersecta una curva visible. Sobre $F_p$, no hay una línea suave que dibujar, pero el álgebra sigue funcionando porque cada operación de coordenadas se reduce módulo $p$.

La traducción práctica es:

- Reemplazar cada coordenada entera por un `FieldElement`.
- Reemplazar la división por multiplicación con el inverso modular.
- Conservar las fórmulas de suma de puntos del capítulo 2.
- Tratar $\mathcal{O}$ como identidad, igual que antes.

Este es el puente entre geometría y criptografía: los campos finitos hacen finito el conjunto de puntos posibles, mientras que la multiplicación escalar sigue siendo fácil en una dirección y difícil de revertir.
