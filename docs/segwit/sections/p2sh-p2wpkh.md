<!-- order: 3 -->

## p2sh-p2wpkh

Para compatibilidad con software que aún no entendía Bech32, SegWit anidó p2wpkh dentro de **p2sh**. La salida bloquea el hash del script `OP_0 <pubkeyhash>`.

- Dirección legacy que empieza por **`3`**
- Al gastar: `script_sig` = `OP_0 <pubkeyhash>` (revela el witness program)
- `witness` = `<firma> <pubkey>` (igual que p2wpkh nativo)

```python-sandbox
import hashlib

def hash160(b: bytes) -> bytes:
    return hashlib.new("ripemd160", hashlib.sha256(b).digest()).digest()

pubkey_hash = b"\xcd" * 20
redeem_script = bytes([0x00, 0x14]) + pubkey_hash
script_pubkey_hash = hash160(redeem_script)
print("p2sh hash20:", script_pubkey_hash.hex())
---
p2sh hash20: 1f96423e7652364167cd33eb0c213c50e9f52bf6
```

El nodo primero resuelve p2sh (comprueba que `hash160(redeem_script)` coincide) y luego ejecuta el witness program como p2wpkh.

> [!TIP]
> Anidar en p2sh ocupa más bytes on-chain que p2wpkh nativo. Usa `bc1q` cuando el destinatario lo soporte.
