<!-- order: 3 -->

## Encabezados de bloque

El **encabezado** de un bloque ocupa exactamente **80 bytes** y resume todo el bloque sin incluir las transacciones completas:

| Campo | Tamaño | Descripción |
|-------|--------|-------------|
| `version` | 4 bytes | Versión del bloque |
| `prev_block` | 32 bytes | Hash del bloque anterior (little-endian) |
| `merkle_root` | 32 bytes | Raíz del árbol de Merkle de las transacciones |
| `timestamp` | 4 bytes | Hora Unix del bloque |
| `bits` | 4 bytes | Target codificado en formato compacto |
| `nonce` | 4 bytes | Número que el minero varía al buscar PoW |

El hash del bloque se calcula haciendo **doble SHA-256** del encabezado serializado:

$$\text{block\_hash} = \text{SHA256}(\text{SHA256}(\text{header}))$$

```python-sandbox
import hashlib

def double_sha256(data: bytes) -> bytes:
    return hashlib.sha256(hashlib.sha256(data).digest()).digest()

# Encabezado ficticio de 80 bytes (todo ceros salvo version=1)
header = b"\x01\x00\x00\x00" + b"\x00" * 76
block_hash = double_sha256(header)
print(block_hash[::-1].hex())  # visualizar en big-endian

```

El campo `merkle_root` conecta el encabezado con todas las transacciones: cambiar una sola transacción altera la raíz y, por tanto, el hash del bloque.

> [!TIP]
> Los nodos pueden intercambiar solo encabezados para sincronizar la cadena de bloques sin descargar cada transacción. Eso es la base de clientes ligeros (SPV), que veremos más adelante.
