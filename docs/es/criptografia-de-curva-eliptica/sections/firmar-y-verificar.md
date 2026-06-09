<!-- order: 7 -->

## Firmar y verificar (ECDSA)

ECDSA produce una firma $(r, s)$ sobre un hash del mensaje $z$:

1. Elegir $k$ aleatorio y calcular $kG = (x, y)$; tomar $r = x \bmod n$ ($n$ es el orden del grupo).
2. Calcular $s = k^{-1}(z + re) \bmod n$, donde $e$ es la llave privada.
3. La firma es el par $(r, s)$.

Para verificar, el receptor comprueba que la ecuación ECDSA se cumple usando la llave pública.

```python-sandbox
# Esquema simplificado (sin curva real)
z = 0xdeadbeef  # hash del mensaje
k = 12345
r = 99   # x de kG mod n
s = 42   # k^-1 (z + r*priv) mod n
print(f"Firma: r={r}, s={s}")
```

> [!TIP]
> El nonce $k$ **nunca** debe reutilizarse ni ser predecible. Un $k$ repetido filtra la llave privada.

### Ecuación de verificación

La verificación reorganiza la firma para que el verificador pueda calcular un punto usando solo datos públicos:

$$u = z / s \pmod{n}$$
$$v = r / s \pmod{n}$$
$$R = uG + vP$$

La firma es válida cuando la coordenada $x$ de $R$ es congruente con $r$ módulo $n$.

```python-sandbox
def inv(n, order):
    return pow(n, order - 2, order)

order = 223
z = 17
r = 42
s = 99
u = z * inv(s, order) % order
v = r * inv(s, order) % order
print("u =", u)
print("v =", v)
print("la verificación real usa: u*G + v*LlavePublica")
```

### Cobertura de práctica del capítulo 3

Ahora deberías poder:

- Comprobar si puntos de campo finito satisfacen $y^2 = x^3 + 7$.
- Sumar y duplicar puntos usando inversos modulares.
- Explicar por qué la multiplicación escalar es rápida pero el logaritmo discreto es difícil.
- Describir el primo del campo, el punto generador y el orden de grupo de secp256k1.
- Convertir un digest de mensaje en el entero $z$ usado por ECDSA.
- Describir firma y verificación sin necesitar la llave privada durante la verificación.
