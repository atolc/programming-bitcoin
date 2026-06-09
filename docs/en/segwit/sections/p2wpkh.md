<!-- order: 2 -->

## Pay-to-Witness-Pubkey-Hash (p2wpkh)

**p2wpkh** locks funds with the hash160 of a public key, just like p2pkh, but the signature lives in the **witness** field, not in `script_sig`.

- Output `script_pubkey`: `OP_0 <20-byte-pubkey-hash>`
- Spending `script_sig`: empty
- `witness`: `<signature> <pubkey>`

The Bech32 address starts with **`bc1q`** on mainnet.

```python-sandbox
import hashlib

def hash160(data: bytes) -> bytes:
    return hashlib.new("ripemd160", hashlib.sha256(data).digest()).digest()

pubkey = b"\x02" + b"\xab" * 32
h160 = hash160(pubkey)
script_pubkey = bytes([0x00, 0x14]) + h160  # OP_0 push20
print("script_pubkey (hex):", script_pubkey.hex())
```

The **witness program** is the version (0) followed by the program (the hash20). When spending, the Script interpreter validates the signature against that hash.

> [!TIP]
> p2wpkh only accepts compressed public keys (33 bytes). An uncompressed key produces a different hash and will not match the expected address.

## Section Completion

P2WPKH keeps the familiar public-key-hash spending condition but moves the unlocking data into the witness. The script_pubkey is a witness program: version 0 plus a 20-byte hash. The spending transaction has an empty script_sig and a witness stack containing signature and public key.

For signing, SegWit uses a different digest algorithm that includes the previous output amount. This prevents certain offline-signing ambiguities and avoids the quadratic hashing problem of legacy signature hashing.

