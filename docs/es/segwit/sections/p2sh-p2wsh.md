<!-- order: 5 -->

## p2sh-p2wsh

Igual que p2sh-p2wpkh, puedes anidar **p2wsh** dentro de p2sh para compatibilidad con direcciones `3...`.

- `redeem_script` = `OP_0 <32-byte-sha256(script)>`
- `script_pubkey` = p2sh del hash160 de ese redeem_script
- Al gastar: `script_sig` revela el redeem_script; `witness` contiene los elementos y el witness script completo

```python-sandbox
import hashlib

def hash160(b: bytes) -> bytes:
    return hashlib.new("ripemd160", hashlib.sha256(b).digest()).digest()

witness_script = b"\x51"  # OP_1 (ejemplo minimo)
program = bytes([0x00, 0x20]) + hashlib.sha256(witness_script).digest()
p2sh = hash160(program)
print("Anidado p2sh-p2wsh, hash20:", p2sh.hex())
---
Anidado p2sh-p2wsh, hash20: 751e76e8199196d454941c45d1b3a323f1433bd6
```

Los flujos multisig complejos suelen usar p2sh-p2wsh para que las firmas queden en witness (descuento de peso) mientras la dirección sigue siendo reconocible por wallets antiguas.

> [!TIP]
> El witness script puede ser grande (multisig 2-de-3, etc.). SegWit lo cobra a tarifa reducida porque el witness tiene peso ×0.25 en el cálculo de `weight`.
