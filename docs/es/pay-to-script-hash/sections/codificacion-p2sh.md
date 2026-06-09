<!-- order: 5 -->

## Codificación P2SH

Construir y gastar un UTXO P2SH requiere tres piezas:

### 1. Redeem script

El programa real (por ejemplo, multisig 2-de-2):

```
OP_2 <pubkey_A> <pubkey_B> OP_2 OP_CHECKMULTISIG
```

### 2. script_pubkey (al recibir)

```
OP_HASH160 <hash160(redeem_script)> OP_EQUAL
```

### 3. script_sig (al gastar)

```
OP_0 <sig_A> <sig_B> <redeem_script completo en bytes>
```

El nodo primero verifica que `HASH160(redeem_script)` coincide con el hash en `script_pubkey`. Luego re-ejecuta el redeem script con las firmas de la pila.

```python-sandbox
import hashlib

def hash160(data):
    return hashlib.new("ripemd160", hashlib.sha256(data).digest()).digest()

redeem = bytes.fromhex("5221" + "ab" * 32 + "21" + "ab" * 32 + "52ae")  # esquema 2-de-2
h = hash160(redeem)
script_pubkey = bytes([0xa9, 0x14]) + h + bytes([0x87])  # HASH160 push EQUAL
print("hash160:", h.hex())
print("script_pubkey:", script_pubkey.hex())
print("Longitud script_pubkey:", len(script_pubkey))
---
hash160: 76f86fa9eee8a97bc160a3ad804ddcde469e2541
script_pubkey: a91476f86fa9eee8a97bc160a3ad804ddcde469e254187
Longitud script_pubkey: 23
```

> [!TIP]
> Al firmar un gasto P2SH, el digest de `SIGHASH` usa el redeem script (no el `script_pubkey` P2SH) en el campo `script_sig` de la entrada que firmas. Este detalle es la fuente más común de errores al implementar P2SH desde cero.
