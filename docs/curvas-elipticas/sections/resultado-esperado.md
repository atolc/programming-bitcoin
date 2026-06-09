<!-- order: 8 -->

## Resultado esperado

Al terminar, deberias entender que las curvas elipticas tienen una operacion de suma bien definida y que esa operacion, aunque rara al principio, es la base para construir criptografia de clave publica.

```quiz
[
  {
    "prompt": "¿Cuál es la forma general de una curva elíptica?",
    "options": ["y = x^2 + bx + c", "y^2 = x^3 + ax + b", "x^2 + y^2 = r^2", "y = a^x"],
    "answer": 1,
    "explanation": "Las curvas elípticas usadas en criptografía siguen la forma y² = x³ + ax + b."
  },
  {
    "prompt": "¿Qué papel cumple el punto al infinito?",
    "options": [
      "Es el generador G de la curva.",
      "Actúa como identidad aditiva en la suma de puntos.",
      "Es el resultado de duplicar cualquier punto.",
      "Representa la llave privada."
    ],
    "answer": 1,
    "explanation": "El punto al infinito O cumple P + O = P para todo punto P."
  },
  {
    "prompt": "Si dos puntos tienen la misma x pero y distintos, ¿qué ocurre al sumarlos?",
    "options": [
      "Se duplica el punto.",
      "El resultado es el punto al infinito.",
      "La suma no está definida.",
      "Se obtiene el generador G."
    ],
    "answer": 1,
    "explanation": "Son puntos inversos aditivos: P + (−P) = O."
  },
  {
    "prompt": "¿Qué fórmula se usa para duplicar un punto P = (x, y)?",
    "options": [
      "λ = (y₂ − y₁) / (x₂ − x₁)",
      "λ = (3x² + a) / (2y)",
      "λ = x + y",
      "λ = y / x"
    ],
    "answer": 1,
    "explanation": "La duplicación usa la pendiente de la tangente: λ = (3x² + a) / (2y)."
  },
  {
    "prompt": "¿Por qué no se suman coordenadas componente a componente?",
    "options": [
      "Porque Python no lo permite.",
      "Porque la suma geométrica/algebraica de puntos en curva no es adición vectorial.",
      "Porque x e y deben ser primos.",
      "Porque solo funciona sobre números reales."
    ],
    "answer": 1,
    "explanation": "La suma en curvas elípticas es una operación algebraica especial, no suma de tuplas."
  }
]
```
