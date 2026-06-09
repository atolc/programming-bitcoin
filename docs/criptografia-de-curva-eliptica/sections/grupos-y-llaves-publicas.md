<!-- order: 6 -->

## Grupos y llaves públicas

Los puntos de una curva elíptica sobre $F_p$ forman un **grupo abeliano**:

- Cerradura bajo la suma.
- Elemento neutro $\mathcal{O}$.
- Inverso aditivo $-P = (x, -y \bmod p)$.
- Asociatividad y conmutatividad.

En criptografía de clave pública:

- **Llave privada**: un entero secreto $e$.
- **Llave pública**: $P = eG$, donde $G$ es el punto generador.

```python-sandbox
# Ilustracion con enteros pequenos (no usar en produccion)
priv = 201
# pub = priv * G  (multiplicacion escalar en la curva)
print(f"Llave privada: {priv}")
print("Llave publica: priv * G (punto en la curva)")
---
Llave privada: 201
Llave publica: priv * G (punto en la curva)
```

La seguridad depende de que nadie pueda recuperar $e$ a partir de $eG$.
