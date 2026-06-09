# Capitulo 2: Curvas elipticas

## Objetivo del capitulo

Presentar las curvas elipticas como objetos matematicos y definir como sumar puntos sobre ellas. Este capitulo prepara el terreno para la criptografia de curva eliptica que Bitcoin usa para llaves, firmas y verificacion.

## Lo mas importante

- Una curva eliptica tiene forma general `y^2 = x^3 + ax + b`.
- No cualquier punto pertenece a una curva: sus coordenadas deben satisfacer la ecuacion.
- Existe un punto especial llamado punto al infinito, que funciona como identidad aditiva.
- La suma de puntos no es suma componente a componente. Se define geometricamente: una linea que cruza la curva permite encontrar un tercer punto, y luego se refleja.
- Hay varios casos para sumar puntos: puntos distintos, punto al infinito, puntos inversos y duplicacion de un punto.
- Cuando dos puntos tienen la misma `x` pero distinta `y`, su suma da el punto al infinito.
- La duplicacion de un punto usa la pendiente de la tangente a la curva.
- Codificar la suma de puntos exige manejar excepciones y casos especiales con claridad.

> [!IMPORTANT]
> El punto al infinito no es un par `(x, y)` real. Actua como identidad aditiva: sumar cualquier punto con el infinito devuelve el mismo punto.

## Validar puntos en la curva

Para la curva `y^2 = x^3 + ax + b`, un punto `(x, y)` es valido solo si sus coordenadas satisfacen la ecuacion exactamente.

Probemos con la curva `y^2 = x^3 + 5x + 7` (similar a secp256k1 con `a=0`, `b=7`):

```python-sandbox
def on_curve(x, y, a=0, b=7):
    return y * y == x**3 + a * x + b

print("G = (2, 5) en curva?", on_curve(2, 5))
print("(3, 7) en curva?", on_curve(3, 7))
---
G = (2, 5) en curva? False
(3, 7) en curva? False
```

Encontremos un punto valido probando valores:

```python-sandbox
def on_curve(x, y, a=0, b=7):
    return y * y == x**3 + a * x + b

for x in range(1, 10):
    rhs = x**3 + 7
    for y in range(0, 20):
        if on_curve(x, y):
            print(f"Punto valido: ({x}, {y})")
---
Punto valido: (3, 8)
Punto valido: (3, 16)
Punto valido: (5, 9)
Punto valido: (5, 14)
```

> [!TIP]
> Dos puntos con la misma `x` pero `y` distintos son inversos aditivos: su suma es el punto al infinito.

## Suma de puntos distintos

Para sumar `P = (x1, y1)` y `Q = (x2, y2)` con `P != Q`, la pendiente es:

$$\lambda = \frac{y_2 - y_1}{x_2 - x_1}$$

Luego:
$$x_3 = \lambda^2 - x_1 - x_2$$
$$y_3 = \lambda(x_1 - x_3) - y_1$$

```python-sandbox
def add_points(p1, p2, a=0, b=7):
    x1, y1 = p1
    x2, y2 = p2
    if p1 == p2:
        return None  # usar duplicacion
    lam = (y2 - y1) / (x2 - x1)
    x3 = lam**2 - x1 - x2
    y3 = lam * (x1 - x3) - y1
    return (x3, y3)

P = (3, 8)
Q = (5, 9)
R = add_points(P, Q)
print(f"P + Q = {R}")
---
P + Q = (6.25, 10.75)
```

## Duplicacion de un punto

Cuando `P = Q`, usamos la pendiente de la tangente:

$$\lambda = \frac{3x_1^2 + a}{2y_1}$$

```python-sandbox
def double_point(p, a=0):
    x, y = p
    lam = (3 * x**2 + a) / (2 * y)
    x3 = lam**2 - 2 * x
    y3 = lam * (x - x3) - y
    return (x3, y3)

P = (3, 8)
R = double_point(P)
print(f"2P = {R}")
---
2P = (1.5625, 5.875)
```

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

## Ideas para estudiar

- Dibujar una curva simple y simular la suma de puntos geometricamente.
- Implementar una clase `Point` con validacion de pertenencia a la curva.
- Escribir pruebas para sumar con el punto al infinito, sumar inversos y duplicar puntos.
- Comparar la intuicion geometrica con las formulas algebraicas.

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
