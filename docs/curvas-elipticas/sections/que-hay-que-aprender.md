<!-- order: 6 -->

## Que hay que aprender

- Como validar si un punto esta en una curva.
- Que representa el punto al infinito y por que es necesario.
- Como se calcula la pendiente para sumar dos puntos distintos.
- Como se calcula la pendiente para duplicar un punto.
- Por que la suma de puntos crea una estructura algebraica util.
- Como modelar puntos y curvas en Python sin mezclar curvas incompatibles.

:::details
Formulas de referencia para suma de puntos

**Puntos distintos (P ≠ Q):**
- λ = (y₂ − y₁) / (x₂ − x₁)
- x₃ = λ² − x₁ − x₂
- y₃ = λ(x₁ − x₃) − y₁

**Duplicacion (P = Q):**
- λ = (3x₁² + a) / (2y₁)
- x₃ = λ² − 2x₁
- y₃ = λ(x₁ − x₃) − y₁

**Casos especiales:**
- P + O = P (O = punto al infinito)
- P + (−P) = O
:::
