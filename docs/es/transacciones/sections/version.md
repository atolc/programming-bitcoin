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
```

> [!TIP]
> La mayoría de transacciones modernas usan versión 2. Al parsear, siempre lee exactamente 4 bytes y convierte con little-endian.

## Complemento de sección

El campo version es pequeño, pero importa para consenso. Version 1 representa el formato original de transacción, mientras que version 2 se asocia con bloqueos relativos de BIP68 y CHECKSEQUENCEVERIFY de BIP112. Un parser debe conservar el entero little-endian de 4 bytes aunque la lección actual solo lo imprima.

En la práctica, version no indica cuántas entradas o salidas existen; eso lo hacen los varints. Trátalo como selector de reglas, no como selector de esquema. La lógica de validación futura puede consultarlo para decidir si los valores sequence tienen semántica de bloqueo relativo.

