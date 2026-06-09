<!-- order: 12 -->

## Cierre

Los campos finitos transforman operaciones matemáticas en sistemas numéricos cerrados, discretos y deterministas. Esta envoltura perfecta es la que permite que Bitcoin use criptografía extremadamente compleja con números de 256 bits sin errores de precisión ni incompatibilidades entre sistemas operativos.

En el **Capítulo 2**, estudiaremos las Curvas Elípticas. En el **Capítulo 3**, uniremos ambas piezas para dar vida a la Criptografía de Curva Elíptica: curvas definidas sobre coordenadas que viven dentro de un campo finito $F_p$.

:::details
Tabla rápida de operaciones en F_p

| Operación | Definición |
|-----------|------------|
| Suma | $(a + b) \bmod p$ |
| Resta | $(a - b) \bmod p$ |
| Multiplicación | $(a \cdot b) \bmod p$ |
| División | $a \cdot b^{p-2} \bmod p$ |
| Potencia | $a^k \bmod p$ |
| Inverso | $a^{p-2} \bmod p$ |
:::

```quiz
[
  {
    "prompt": "En F19, ¿cuál es el resultado de 11 + 17?",
    "options": ["28", "9", "17", "0"],
    "answer": 1,
    "explanation": "Primero sumas como enteros y luego aplicas modulo: 28 % 19 = 9."
  },
  {
    "prompt": "¿Por qué se usa un modulo primo para estos campos?",
    "options": [
      "Porque garantiza inversos multiplicativos para todo elemento no cero.",
      "Porque hace que todas las operaciones sean mas rapidas que la suma normal.",
      "Porque evita que existan elementos negativos.",
      "Porque Bitcoin solo acepta numeros menores que 19."
    ],
    "answer": 0,
    "explanation": "En un campo de orden primo, cada elemento distinto de cero tiene inverso multiplicativo."
  },
  {
    "prompt": "¿Qué significa dividir a / b dentro de un campo finito?",
    "options": [
      "Calcular un decimal y redondearlo.",
      "Restar b repetidas veces hasta llegar a a.",
      "Multiplicar a por el inverso multiplicativo de b.",
      "Usar division entera de Python."
    ],
    "answer": 2,
    "explanation": "La division se define como a * b^(-1), siempre que b no sea cero."
  },
  {
    "prompt": "Según el pequeño teorema de Fermat, si p es primo y n no es cero, ¿qué vale n^(p-1) % p?",
    "options": ["0", "1", "p - 1", "n"],
    "answer": 1,
    "explanation": "Ese resultado permite calcular inversos con n^(p-2) dentro de Fp."
  },
  {
    "prompt": "En la clase FieldElement, ¿qué se debe validar antes de sumar dos elementos?",
    "options": [
      "Que tengan el mismo prime.",
      "Que ambos numeros sean pares.",
      "Que el resultado no use modulo.",
      "Que el exponente sea positivo."
    ],
    "answer": 0,
    "explanation": "Sumar elementos de campos distintos no tiene significado dentro de esta abstraccion."
  }
]
```
