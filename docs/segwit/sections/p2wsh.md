<!-- order: 4 -->

## Pay-to-Witness-Script-Hash (p2wsh)

**p2wsh** generaliza p2wpkh a scripts arbitrarios. El witness program es la versión 0 seguida del **SHA256** del script (*witness script*), no su hash160.

- `script_pubkey`: `OP_0 <32-byte-script-hash>`
- `witness`: `<elementos del stack> ... <witness script>`
- Dirección Bech32: **`bc1q`** con programa de 32 bytes

```python-sandbox
import hashlib

witness_script = bytes.fromhex("522102" + "ab" * 32 + "2102" + "cd" * 32 + "52ae")
wsh = hashlib.sha256(witness_script).digest()
script_pubkey = bytes([0x00, 0x20]) + wsh
print("Longitud script_pubkey:", len(script_pubkey))
---
Longitud script_pubkey: 34
```

Al validar, el intérprete comprueba que `SHA256(witness_script)` coincide con el programa y luego ejecuta el script con los elementos del witness como stack inicial.

> [!TIP]
> p2wsh es el análogo SegWit de p2sh multisig y contratos personalizados. El witness script solo se revela al gastar, igual que el redeem script en p2sh clásico.
