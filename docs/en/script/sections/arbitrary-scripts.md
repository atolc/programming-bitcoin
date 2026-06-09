<!-- order: 9 -->

## Arbitrary Scripts

Bitcoin allows custom scripts beyond P2PK and P2PKH, as long as they respect consensus rules:

- Maximum `script_pubkey` size: 10,000 bytes.
- Maximum `script_sig` size: previously limited; with SegWit, the witness has its own limit.
- Disabled opcodes cannot be used.
- The script must end with a true result on the stack.

Historical examples:

| Type | Idea |
|------|------|
| Multisig | Requires $m$-of-$n$ signatures |
| HTLC | Lock with hash preimage + timeout |
| Puzzles | Solve a mathematical puzzle to claim funds |

```python-sandbox
# Simple puzzle: OP_HASH160 <hash> OP_EQUAL
# Only whoever knows the preimage can spend
import hashlib

def hash160(data):
    return hashlib.new("ripemd160", hashlib.sha256(data).digest()).digest()

secret = b"hello"
h = hash160(secret)
print("Puzzle hash:", h.hex())
print("Valid preimage:", hash160(b"hello") == h)
---
Puzzle hash: 77c8c5d8228355835c70b1e5be2bf7de906cd4b1
Valid preimage: True
```

> [!TIP]
> Bare arbitrary scripts expose the full logic in the `script_pubkey`, which increases UTXO set size and complicates validation. That is why P2SH was created, covered in chapter 8.
