<!-- order: 2 -->

## Orden de bytes (endianness)

Un entero de 32 bits como $305419896$ ($0x12345678$) puede guardarse en memoria de dos maneras:

- **Big-endian**: el byte más significativo primero → `12 34 56 78`
- **Little-endian**: el byte menos significativo primero → `78 56 34 12`

Bitcoin mezcla ambos estilos según el contexto:

| Campo | Endianness típico |
|-------|-------------------|
| Versión de transacción | Little-endian |
| Valor de salida (satoshis) | Little-endian |
| Hash de bloque en exploradores | Big-endian (visualización) |
| Hash interno en protocolo | Little-endian |

```python-sandbox
n = 0x12345678
big = n.to_bytes(4, "big")
little = n.to_bytes(4, "little")
print("big-endian:   ", big.hex())
print("little-endian:", little.hex())
```

> [!TIP]
> Cuando un hash se muestra en un explorador de bloques, suele verse en **big-endian** (más legible). Internamente, al serializar transacciones, muchos campos usan **little-endian**. Siempre verifica el contexto antes de comparar bytes.

### Helpers de enteros

El código Bitcoin suele envolver conversiones de orden de bytes en helpers explícitos para que cada llamada documente su intención.

```python-sandbox
def little_endian_to_int(raw):
    return int.from_bytes(raw, "little")

def int_to_little_endian(n, length):
    return n.to_bytes(length, "little")

raw = bytes.fromhex("78563412")
n = little_endian_to_int(raw)
print(n)
print(int_to_little_endian(n, 4).hex())
```

### Cobertura de práctica del capítulo 4

Después de este capítulo deberías poder:

- Serializar y parsear llaves públicas SEC comprimidas y sin comprimir.
- Codificar y parsear firmas DER con marcadores y longitudes correctas.
- Producir cadenas Base58Check y rechazar checksums inválidos.
- Convertir enteros a bytes little-endian y desde bytes little-endian.
- Explicar por qué los formatos de visualización y los formatos de red de Bitcoin a veces muestran hashes en órdenes de bytes opuestos.
