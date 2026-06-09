<!-- order: 5 -->

## p2sh-p2wsh

Just like p2sh-p2wpkh, you can nest **p2wsh** inside p2sh for compatibility with `3...` addresses.

- `redeem_script` = `OP_0 <32-byte-sha256(script)>`
- `script_pubkey` = p2sh of the hash160 of that redeem_script
- When spending: `script_sig` reveals the redeem_script; `witness` contains the elements and the full witness script

```python-sandbox
import hashlib

def hash160(b: bytes) -> bytes:
    return hashlib.new("ripemd160", hashlib.sha256(b).digest()).digest()

witness_script = b"\x51"  # OP_1 (ejemplo minimo)
program = bytes([0x00, 0x20]) + hashlib.sha256(witness_script).digest()
p2sh = hash160(program)
print("Nested p2sh-p2wsh, hash20:", p2sh.hex())
```

Complex multisig flows often use p2sh-p2wsh so signatures stay in witness (weight discount) while the address remains recognizable to older wallets.

> [!TIP]
> The witness script can be large (2-of-3 multisig, etc.). SegWit charges it at a reduced rate because witness has weight ×0.25 in the `weight` calculation.
