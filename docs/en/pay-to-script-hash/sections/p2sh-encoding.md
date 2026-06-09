<!-- order: 5 -->

## P2SH Encoding

Building and spending a P2SH UTXO requires three pieces:

### 1. Redeem Script

The actual program (for example, 2-of-2 multisig):

```
OP_2 <pubkey_A> <pubkey_B> OP_2 OP_CHECKMULTISIG
```

### 2. script_pubkey (when receiving)

```
OP_HASH160 <hash160(redeem_script)> OP_EQUAL
```

### 3. script_sig (when spending)

```
OP_0 <sig_A> <sig_B> <full redeem_script in bytes>
```

The node first verifies that `HASH160(redeem_script)` matches the hash in `script_pubkey`. Then it re-executes the redeem script with the signatures from the stack.

```python-sandbox
import hashlib

def hash160(data):
    return hashlib.new("ripemd160", hashlib.sha256(data).digest()).digest()

redeem = bytes.fromhex("5221" + "ab" * 32 + "21" + "ab" * 32 + "52ae")  # 2-of-2 scheme
h = hash160(redeem)
script_pubkey = bytes([0xa9, 0x14]) + h + bytes([0x87])  # HASH160 push EQUAL
print("hash160:", h.hex())
print("script_pubkey:", script_pubkey.hex())
print("script_pubkey length:", len(script_pubkey))
```

> [!TIP]
> When signing a P2SH spend, the `SIGHASH` digest uses the redeem script (not the P2SH `script_pubkey`) in the `script_sig` field of the input you are signing. This detail is the most common source of errors when implementing P2SH from scratch.

## Section Completion

P2SH encoding has three byte-level objects that must not be confused: the redeem script, the P2SH script_pubkey, and the spending script_sig. The redeem script is the real spending condition. The script_pubkey is OP_HASH160 <hash160(redeem_script)> OP_EQUAL. The script_sig pushes the data needed by the redeem script and finally the redeem script itself.

For signatures, the redeem script is also the script used in the signing digest for the input being signed. Using the short P2SH script_pubkey in that position creates invalid signatures. This detail is the heart of implementing P2SH correctly.

