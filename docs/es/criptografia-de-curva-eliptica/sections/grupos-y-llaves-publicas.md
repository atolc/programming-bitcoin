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
```

La seguridad depende de que nadie pueda recuperar $e$ a partir de $eG$.

### Flujo de llaves públicas

El flujo criptográfico del capítulo es:

1. Elegir una llave privada $e$.
2. Calcular la llave pública $P = eG$.
3. Publicar $P$ y mantener $e$ en secreto.
4. Firmar un hash de mensaje $z$ con $e$.
5. Verificar la firma con $P$.

Lo difícil no es multiplicar $G$ por $e$; eso es rápido. Lo difícil es empezar con $P$ y descubrir qué $e$ lo produjo.

```python-sandbox
def toy_scalar_mult(k, g, order):
    return (k * g) % order

order = 223
generator = 47
private_key = 91
public_key = toy_scalar_mult(private_key, generator, order)
print("llave pública de juguete:", public_key)
```
