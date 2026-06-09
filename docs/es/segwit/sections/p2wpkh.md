<!-- order: 2 -->

## Pay-to-Witness-Pubkey-Hash (p2wpkh)

**p2wpkh** bloquea fondos con el hash160 de una clave pública, igual que p2pkh, pero la firma vive en el campo **witness**, no en `script_sig`.

- `script_pubkey` en la salida: `OP_0 <20-byte-pubkey-hash>`
- `script_sig` en el gasto: vacío
- `witness`: `<firma> <pubkey>`

La dirección Bech32 empieza por **`bc1q`** en mainnet.

```python-sandbox
import hashlib

def hash160(data: bytes) -> bytes:
    return hashlib.new("ripemd160", hashlib.sha256(data).digest()).digest()

pubkey = b"\x02" + b"\xab" * 32
h160 = hash160(pubkey)
script_pubkey = bytes([0x00, 0x14]) + h160  # OP_0 push20
print("script_pubkey (hex):", script_pubkey.hex())
```

El **witness program** es la versión (0) seguida del programa (el hash20). Al gastar, el intérprete Script valida la firma contra ese hash.

> [!TIP]
> p2wpkh solo acepta claves públicas comprimidas (33 bytes). Una clave sin comprimir produce un hash distinto y no coincide con la dirección esperada.
