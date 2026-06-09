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
---
SEC comprimido: 33 bytes
0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798
```

> [!TIP]
> Bitcoin prefiere llaves comprimidas desde la versión 0.6: ocupan la mitad de espacio y reducen el tamaño de las transacciones que las referencian.
