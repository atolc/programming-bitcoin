<!-- order: 3 -->

## Versión

El primer campo de una transacción es un entero de 32 bits en **little-endian** que indica la versión del formato.

| Versión | Significado |
|---------|-------------|
| 1 | Formato original de Satoshi |
| 2 | BIP 68 (secuencia relativa) y BIP 112 (CHECKSEQUENCEVERIFY) |

La versión no cambia la estructura básica de entradas y salidas, pero activa reglas de consenso adicionales cuando los nodos la interpretan.

```python-sandbox
version = 2
serialized = version.to_bytes(4, "little")
print("Versión 2 en bytes:", serialized.hex())
recovered = int.from_bytes(serialized, "little")
print("Recuperada:", recovered)
---
Versión 2 en bytes: 02000000
Recuperada: 2
```

> [!TIP]
> La mayoría de transacciones modernas usan versión 2. Al parsear, siempre lee exactamente 4 bytes y convierte con little-endian.
