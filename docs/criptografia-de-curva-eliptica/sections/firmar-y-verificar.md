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
---
Firma: r=99, s=42
```

> [!TIP]
> El nonce $k$ **nunca** debe reutilizarse ni ser predecible. Un $k$ repetido filtra la llave privada.
