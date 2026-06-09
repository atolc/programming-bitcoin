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

## Complemento de sección

Las transacciones de interés dependen de la wallet: pagos a tus scripts, gastos desde tus UTXO o transacciones que revelan descendientes que debes rastrear. El matching Bloom puede ocurrir en scripts de salida, outpoints de entrada, empujes de datos y a veces reglas de actualización que agregan nuevos outpoints relevantes automáticamente.

Los falsos positivos son esperados y deben ser inofensivos si la verificación es local. La wallet descarga y parsea transacciones extra, revisa si afectan realmente su estado e ignora el resto. El costo es ancho de banda y privacidad, no pérdida directa de fondos.

