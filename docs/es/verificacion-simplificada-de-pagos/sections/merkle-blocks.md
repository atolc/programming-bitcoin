<!-- order: 4 -->

## Bloques Merkle

Un mensaje **`merkleblock`** combina un encabezado de bloque con una prueba Merkle parcial y metadatos de flags. Así un nodo completo puede demostrar que ciertas transacciones están en el bloque sin enviar todas las transacciones.

Estructura simplificada:

```
[header: 80 bytes]
[total_transactions: varint]
[hashes: varint + lista de hashes internos necesarios para la prueba]
[flags: varint + bits que marcan qué hojas interesan]
```

El cliente SPV:

1. Verifica el encabezado (enlace `prev_block` + PoW).
2. Usa `hashes` y `flags` para reconstruir la raíz Merkle.
3. Compara esa raíz con `merkle_root` del encabezado.

```python-sandbox
def verify_merkle_root(computed: bytes, header_root: bytes) -> bool:
    return computed == header_root

header_merkle_root = bytes.fromhex("ab" * 32)
computed_root = bytes.fromhex("ab" * 32)
print("Prueba valida?", verify_merkle_root(computed_root, header_merkle_root))
```

Si la raíz coincide, la transacción de interés está **comprometida** en ese bloque. La profundidad de confirmación (bloques encadenados después) mide cuánto confiar en la irreversibilidad del pago.

> [!TIP]
> Un `merkleblock` malicioso podría omitir transacciones en los flags. Por eso el cliente debe reconstruir el árbol completo según BIP37 y rechazar pruebas inconsistentes.

## Complemento de sección

Un merkleblock es un objeto compacto de prueba. Contiene un header de bloque, cantidad total de transacciones, hashes seleccionados y bits de flags que describen qué ramas explorar. El verificador reconstruye suficiente árbol para calcular la raíz sin recibir todos los hashes de transacción.

El parseo correcto tiene estado: consume bits de flag y hashes en el orden exacto de recorrido. Si sobran hashes, se acaban flags o la raíz calculada difiere del merkle_root del header, la prueba debe rechazarse.

