<!-- order: 2 -->

## Componentes de una transacción

Toda transacción Bitcoin sigue la misma plantilla binaria:

```
[versión: 4 bytes]
[cantidad de entradas: varint]
  [entrada 1]
  [entrada 2]
  ...
[cantidad de salidas: varint]
  [salida 1]
  [salida 2]
  ...
[locktime: 4 bytes]
```

Cada **entrada** referencia una salida previa (un UTXO) y aporta datos para demostrar el derecho a gastarla. Cada **salida** define cuántos satoshis se envían y qué script debe cumplirse para gastarlos en el futuro.

```python-sandbox
# Esquema conceptual
tx = {
    "version": 2,
    "inputs": [{"prev_tx": "abc...", "index": 0, "script_sig": b"", "sequence": 0xffffffff}],
    "outputs": [{"amount": 50000, "script_pubkey": b"76a914..."}],
    "locktime": 0,
}
print(f"Entradas: {len(tx['inputs'])}, Salidas: {len(tx['outputs'])}")
```

> [!TIP]
> Una transacción no contiene direcciones: contiene **scripts**. Las direcciones son una convención humana derivada del `script_pubkey`.
