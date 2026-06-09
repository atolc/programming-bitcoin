<!-- order: 7 -->

## Codificación de transacciones

Para serializar una transacción completa concatenamos cada campo en orden. Los enteros de longitud variable usan **varint** (compact size):

| Valor | Bytes |
|-------|-------|
| $< 0xfd$ | 1 byte |
| $\leq 0xffff$ | `0xfd` + 2 bytes LE |
| $\leq 0xffffffff$ | `0xfe` + 4 bytes LE |
| Mayor | `0xff` + 8 bytes LE |

```python
def encode_varint(n):
    if n < 0xfd:
        return bytes([n])
    if n <= 0xffff:
        return b"\xfd" + n.to_bytes(2, "little")
    if n <= 0xffffffff:
        return b"\xfe" + n.to_bytes(4, "little")
    return b"\xff" + n.to_bytes(8, "little")
```

El **txid** es el doble SHA-256 de la transacción serializada, mostrado en orden inverso:

$$\text{txid} = \text{reverse}(\text{SHA256}(\text{SHA256}(\text{tx serializada})))$$

```python-sandbox
import hashlib

def double_sha256(data):
    return hashlib.sha256(hashlib.sha256(data).digest()).digest()

raw = bytes.fromhex("0200000001")  # fragmento de ejemplo
txid = double_sha256(raw)[::-1]
print("txid (ejemplo):", txid.hex())
```

> [!TIP]
> Al firmar una transacción, se serializa una variante modificada (sin `script_sig` en las entradas, con `SIGHASH` flags). Eso lo veremos al crear y validar transacciones.
