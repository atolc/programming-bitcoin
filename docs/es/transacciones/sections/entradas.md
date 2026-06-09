<!-- order: 4 -->

## Entradas

Cada entrada (*input*) gasta un UTXO existente. Su estructura:

```
[hash de la tx previa: 32 bytes, little-endian internamente]
[índice de salida: 4 bytes, little-endian]
[longitud del script_sig: varint]
[script_sig: bytes]
[sequence: 4 bytes, little-endian]
```

El **hash de la transacción previa** apunta al UTXO que se consume. El **índice** indica qué salida de esa transacción se gasta (empezando en 0).

El **script_sig** contiene la prueba de autorización: firmas, llaves públicas u otros datos según el tipo de script.

La **sequence** controla reemplazo (RBF) y bloqueo relativo (BIP 68). El valor `0xffffffff` es el predeterminado.

```python-sandbox
prev_hash = bytes.fromhex("a1b2c3d4" * 8)  # 32 bytes
index = 0
sequence = 0xffffffff
print(f"Input apunta a tx {prev_hash[:4].hex()}... salida #{index}")
print(f"Sequence: {sequence:#010x}")
```

> [!TIP]
> El hash de la tx previa se almacena en orden **inverso** respecto a como lo muestran los exploradores. Si copias un txid de un explorador, debes invertir los bytes antes de serializar.
