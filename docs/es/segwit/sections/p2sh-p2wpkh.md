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
```

El nodo primero resuelve p2sh (comprueba que `hash160(redeem_script)` coincide) y luego ejecuta el witness program como p2wpkh.

> [!TIP]
> Anidar en p2sh ocupa más bytes on-chain que p2wpkh nativo. Usa `bc1q` cuando el destinatario lo soporte.

## Complemento de sección

P2SH-P2WPKH envuelve un programa witness nativo dentro de un redeem script P2SH. La salida de fondeo parece P2SH para wallets antiguas, mientras nodos actualizados reconocen que el redeem script es OP_0 <hash-de-20-bytes> y luego validan datos witness.

El gasto tiene dos lugares para datos: script_sig revela solo el redeem script, y witness aporta firma más llave pública. Si script_sig contiene algo más, la validación falla para esta plantilla.

