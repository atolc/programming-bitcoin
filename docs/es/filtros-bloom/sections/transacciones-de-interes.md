<!-- order: 6 -->

## Transacciones de interés

Cuando una transacción del bloque coincide con el filtro Bloom, el nodo la envía en mensajes **`tx`** además del `merkleblock`. La wallet:

1. Verifica la prueba Merkle (transacción incluida en el bloque).
2. Inspecciona entradas y salidas para ver si afectan a sus direcciones.
3. Actualiza el saldo y el historial local.

```python-sandbox
def affects_wallet(tx_outputs, watched_scripts: set) -> bool:
    return any(script in watched_scripts for script in tx_outputs)

watched = {b"\x76\xa9\x14" + b"pubkeyhash"}
outputs = [b"\x76\xa9\x14" + b"pubkeyhash", b"\x00\xa9\x14" + b"other"]
print("Nos afecta?", affects_wallet(outputs, watched))
```

Los **falsos positivos** del filtro hacen que recibas `tx` ajenas ocasionalmente. La wallet las descarta tras parsear; el coste es ancho de banda, no seguridad directa.

Para pagos recibidos, muchas wallets esperan varias confirmaciones (más bloques encadenados después) antes de considerar el fondo gastable.

> [!TIP]
> Guarda el `merkleblock` y las `tx` asociadas si quieres auditar pagos offline: con la prueba Merkle y el encabezado puedes demostrar inclusión sin confiar en el nodo en el futuro.
