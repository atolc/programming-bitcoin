<!-- order: 8 -->

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
