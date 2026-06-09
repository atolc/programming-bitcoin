<!-- order: 3 -->

## Llaves públicas SEC (comprimidas y sin comprimir)

El formato **SEC** (*Standards for Efficient Cryptography*) serializa un punto de curva elíptica como secuencia de bytes.

### Sin comprimir

Prefijo `0x04` seguido de las coordenadas $x$ e $y$, cada una de 32 bytes en secp256k1:

$$\text{SEC}_{\text{sin comprimir}} = 0x04 \,\|\, x_{32} \,\|\, y_{32}$$

Total: **65 bytes**.

### Comprimido

La curva es simétrica respecto al eje $x$: dado $x$, solo hay dos valores posibles de $y$ (par o impar). El formato comprimido guarda:

- `0x02` si $y$ es par
- `0x03` si $y$ es impar

seguido de $x$ (32 bytes). Total: **33 bytes**.

```python-sandbox
# Esquema simplificado (coordenadas de ejemplo)
x = bytes.fromhex("79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798")
y_par = True  # y es par en este ejemplo
prefix = b"\x02" if y_par else b"\x03"
sec_compressed = prefix + x
print(f"SEC comprimido: {len(sec_compressed)} bytes")
print(sec_compressed.hex())
```

> [!TIP]
> Bitcoin prefiere llaves comprimidas desde la versión 0.6: ocupan la mitad de espacio y reducen el tamaño de las transacciones que las referencian.

### Serializar y parsear

Serializar convierte un punto en bytes. Parsear revierte el proceso. En SEC sin comprimir, ambas coordenadas están presentes. En SEC comprimido, la coordenada $y$ faltante se recupera resolviendo:

$$y^2 = x^3 + 7 \pmod{p}$$

Como el primo de secp256k1 satisface $p \bmod 4 = 3$, una raíz cuadrada se puede calcular con:

$$y = \alpha^{(p+1)/4} \pmod{p}$$

donde $\alpha = x^3 + 7$.

```python-sandbox
P = 2**256 - 2**32 - 977

def sec_uncompressed(x, y):
    return b"\x04" + x.to_bytes(32, "big") + y.to_bytes(32, "big")

def sec_compressed(x, y):
    prefix = b"\x02" if y % 2 == 0 else b"\x03"
    return prefix + x.to_bytes(32, "big")

def parse_compressed(sec):
    prefix = sec[0]
    x = int.from_bytes(sec[1:], "big")
    alpha = (pow(x, 3, P) + 7) % P
    beta = pow(alpha, (P + 1) // 4, P)
    even_beta = beta if beta % 2 == 0 else P - beta
    odd_beta = P - even_beta
    y = even_beta if prefix == 2 else odd_beta
    return x, y

gx = int("79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", 16)
gy = int("483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", 16)
compressed = sec_compressed(gx, gy)
print(compressed.hex())
print(parse_compressed(compressed)[1] == gy)
```
