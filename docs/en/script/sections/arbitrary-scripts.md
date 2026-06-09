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
```

> [!TIP]
> Bare arbitrary scripts expose the full logic in the `script_pubkey`, which increases UTXO set size and complicates validation. That is why P2SH was created, covered in chapter 8.

## Section Completion

Bitcoin permits more than the common standard templates, but policy and consensus are different layers. A script can be consensus-valid yet non-standard for relay or mining policy. This distinction lets Bitcoin keep the consensus language stable while discouraging outputs that are expensive, risky, or hard for the network to relay.

Arbitrary scripts also motivate P2SH. If complex logic is placed directly in script_pubkey, every full node must store it in the UTXO set before the coins are spent. P2SH keeps the UTXO small and reveals complexity only at spend time.

