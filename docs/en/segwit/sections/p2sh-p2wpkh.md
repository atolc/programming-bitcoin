<!-- order: 3 -->

## p2sh-p2wpkh

For compatibility with software that did not yet understand Bech32, SegWit nested p2wpkh inside **p2sh**. The output locks the hash of the script `OP_0 <pubkeyhash>`.

- Legacy address starting with **`3`**
- When spending: `script_sig` = `OP_0 <pubkeyhash>` (reveals the witness program)
- `witness` = `<signature> <pubkey>` (same as native p2wpkh)

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

The node first resolves p2sh (checks that `hash160(redeem_script)` matches) and then executes the witness program as p2wpkh.

> [!TIP]
> Nesting in p2sh uses more on-chain bytes than native p2wpkh. Use `bc1q` when the recipient supports it.
