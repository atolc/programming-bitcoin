<!-- order: 6 -->

## Que hay que aprender

- Como se combinan campos finitos y curvas elipticas.
- Que son `P`, `N`, `G`, llave privada, llave publica, firma `r,s` y mensaje `z`.
- Como implementar multiplicacion escalar de forma eficiente con doble-y-suma.
- Como funciona la firma ECDSA a nivel conceptual.
- Como verificar firmas ECDSA sin conocer la llave privada.
- Por que el nonce de firma debe ser unico y secreto.

:::details
Parámetros de secp256k1

| Parámetro | Valor |
|-----------|-------|
| Ecuación | y² = x³ + 7 |
| Campo primo P | 2²⁵⁶ − 2³² − 977 |
| Orden del grupo N | ~2²⁵⁶ |
| Generador G | Punto fijo de la curva |
| Llave privada | Entero aleatorio en [1, N−1] |
| Llave pública | priv × G |
:::
