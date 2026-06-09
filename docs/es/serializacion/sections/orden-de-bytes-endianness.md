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
---
big-endian:    12345678
little-endian: 78563412
```

> [!TIP]
> Cuando un hash se muestra en un explorador de bloques, suele verse en **big-endian** (más legible). Internamente, al serializar transacciones, muchos campos usan **little-endian**. Siempre verifica el contexto antes de comparar bytes.
