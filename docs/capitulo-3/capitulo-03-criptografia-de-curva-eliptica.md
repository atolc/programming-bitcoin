# Capitulo 3: Criptografia de curva eliptica

## Objetivo del capitulo

Unir campos finitos y curvas elipticas para construir la criptografia que usa Bitcoin. El capitulo introduce `secp256k1`, multiplicacion escalar, llaves privadas/publicas, firmas y verificacion.

## Lo mas importante

- Bitcoin no usa curvas sobre numeros reales, sino curvas elipticas sobre campos finitos.
- La curva de Bitcoin es `secp256k1`, definida por `y^2 = x^3 + 7` sobre un campo primo enorme.
- La multiplicacion escalar consiste en sumar un punto consigo mismo muchas veces.
- Una llave privada es un numero secreto; la llave publica es ese numero multiplicado por el punto generador `G`.
- Es facil calcular la llave publica desde la privada, pero impractico recuperar la privada desde la publica. Esa asimetria es el problema del logaritmo discreto.
- El orden del grupo define cuantas veces se puede sumar `G` antes de volver al punto al infinito.
- Firmar prueba conocimiento de la llave privada sin revelarla.
- Verificar una firma usa la llave publica, el mensaje y la firma para confirmar que el propietario de la llave privada autorizo el mensaje.
- La seguridad practica depende de elegir bien valores aleatorios como `k`; reutilizar o filtrar `k` puede revelar la llave privada.

> [!IMPORTANT]
> La llave privada es un entero aleatorio en el rango `[1, N-1]`. Nunca debe reutilizarse el nonce `k` en firmas ECDSA: dos firmas con el mismo `k` pueden filtrar la llave privada.

## secp256k1 en números pequeños

Bitcoin usa un primo enorme, pero la lógica es la misma sobre un campo pequeño. Simulemos con `p = 223`:

```python-sandbox
p = 223
a = 0
b = 7

def on_curve(x, y):
    return (y * y - (x**3 + a * x + b)) % p == 0

G = (170, 142)
print("G en curva?", on_curve(*G))
---
G en curva? True
```

## Multiplicación escalar (double-and-add)

Multiplicar un punto por un escalar `k` significa sumar `P` consigo mismo `k` veces. El algoritmo double-and-add es eficiente:

```python-sandbox
def scalar_mult(k, point, p, a=0):
    current = None
    result = None
    addend = point
    while k:
        if k & 1:
            result = addend if result is None else add_points(result, addend, p, a)
        addend = double_point(addend, p, a)
        k >>= 1
    return result

def add_points(p1, p2, p, a=0):
    if p1 is None: return p2
    if p2 is None: return p1
    x1, y1 = p1
    x2, y2 = p2
    if x1 == x2 and y1 != y2:
        return None
    if p1 == p2:
        lam = (3 * x1 * x1 + a) * pow(2 * y1, p - 2, p) % p
    else:
        lam = (y2 - y1) * pow(x2 - x1, p - 2, p) % p
    x3 = (lam * lam - x1 - x2) % p
    y3 = (lam * (x1 - x3) - y1) % p
    return (x3, y3)

def double_point(p, p_mod, a=0):
    return add_points(p, p, p_mod, a)

p = 223
G = (170, 142)
priv = 7
pub = scalar_mult(priv, G, p)
print(f"Llave privada: {priv}")
print(f"Llave publica (7*G): {pub}")
---
Llave privada: 7
Llave publica (7*G): (49, 71)
```

## Hashing de mensajes (concepto)

Las firmas ECDSA operan sobre un hash del mensaje, no sobre el mensaje completo:

```python-sandbox
import hashlib

message = b"Programming Bitcoin"
z = int.from_bytes(hashlib.sha256(message).digest(), "big")
print(f"Mensaje: {message.decode()}")
print(f"Hash z (primeros digitos): {str(z)[:20]}...")
print(f"Longitud del hash: {z.bit_length()} bits")
---
Mensaje: Programming Bitcoin
Hash z (primeros digitos): 958835051435323862...
Longitud del hash: 256 bits
```

> [!WARNING]
> Si el nonce `k` se repite en dos firmas distintas, un atacante puede calcular la llave privada. Por eso Bitcoin usa RFC6979 para generar `k` de forma determinista pero segura.

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

## Ideas para estudiar

- Implementar clases especializadas para `S256Field`, `S256Point` y `Signature`.
- Probar que `N * G` produce el punto al infinito.
- Firmar y verificar mensajes de prueba.
- Estudiar la diferencia entre "autenticidad" y "secreto": las firmas no cifran, autorizan.

## Resultado esperado

Al terminar, deberias poder explicar como una llave privada genera una llave publica, por que esa relacion es segura en una sola direccion y como una firma demuestra autorizacion en una transaccion Bitcoin.

```quiz
[
  {
    "prompt": "¿Qué curva usa Bitcoin?",
    "options": ["P-256", "secp256k1", "Ed25519", "RSA-2048"],
    "answer": 1,
    "explanation": "Bitcoin usa secp256k1: y² = x³ + 7 sobre un campo primo de ~256 bits."
  },
  {
    "prompt": "¿Cómo se obtiene la llave pública desde la privada?",
    "options": [
      "Hasheando la llave privada con SHA256.",
      "Multiplicando la llave privada por el generador G.",
      "Elevando G al cuadrado.",
      "Dividiendo G entre la llave privada."
    ],
    "answer": 1,
    "explanation": "La llave pública es priv × G mediante multiplicación escalar en la curva."
  },
  {
    "prompt": "¿Por qué es seguro el esquema de llaves?",
    "options": [
      "Porque la llave privada se cifra con AES.",
      "Porque el logaritmo discreto es computacionalmente difícil.",
      "Porque G es secreto.",
      "Porque el campo primo es par."
    ],
    "answer": 1,
    "explanation": "Calcular priv desde pub equivale a resolver el logaritmo discreto, que es intratable."
  },
  {
    "prompt": "¿Qué representa z en una firma ECDSA?",
    "options": [
      "La llave privada.",
      "El hash numérico del mensaje firmado.",
      "El nonce aleatorio k.",
      "El orden del grupo N."
    ],
    "answer": 1,
    "explanation": "z es el hash del mensaje convertido a entero, sobre el cual se firma."
  },
  {
    "prompt": "¿Qué riesgo hay si se reutiliza el nonce k en dos firmas?",
    "options": [
      "La firma se vuelve más larga.",
      "Se puede filtrar la llave privada.",
      "La transacción se confirma más rápido.",
      "No hay ningún riesgo."
    ],
    "answer": 1,
    "explanation": "Dos firmas con el mismo k permiten resolver un sistema de ecuaciones y obtener la llave privada."
  }
]
```
