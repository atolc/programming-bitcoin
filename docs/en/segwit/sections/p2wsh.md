<!-- order: 4 -->

## Pay-to-Witness-Script-Hash (p2wsh)

**p2wsh** generalizes p2wpkh to arbitrary scripts. The witness program is version 0 followed by the **SHA256** of the script (*witness script*), not its hash160.

- `script_pubkey`: `OP_0 <32-byte-script-hash>`
- `witness`: `<stack elements> ... <witness script>`
- Bech32 address: **`bc1q`** with a 32-byte program

```python-sandbox
import hashlib

witness_script = bytes.fromhex("522102" + "ab" * 32 + "2102" + "cd" * 32 + "52ae")
wsh = hashlib.sha256(witness_script).digest()
script_pubkey = bytes([0x00, 0x20]) + wsh
print("script_pubkey length:", len(script_pubkey))
---
script_pubkey length: 34
```

When validating, the interpreter checks that `SHA256(witness_script)` matches the program and then executes the script with the witness elements as the initial stack.

> [!TIP]
> p2wsh is the SegWit analogue of p2sh multisig and custom contracts. The witness script is only revealed when spending, just like the redeem script in classic p2sh.
