<!-- order: 7 -->

## Transaction Encoding

To serialize a complete transaction we concatenate each field in order. Variable-length integers use **varint** (compact size):

| Value | Bytes |
|-------|-------|
| $< 0xfd$ | 1 byte |
| $\leq 0xffff$ | `0xfd` + 2 bytes LE |
| $\leq 0xffffffff$ | `0xfe` + 4 bytes LE |
| Larger | `0xff` + 8 bytes LE |

```python
def encode_varint(n):
    if n < 0xfd:
        return bytes([n])
    if n <= 0xffff:
        return b"\xfd" + n.to_bytes(2, "little")
    if n <= 0xffffffff:
        return b"\xfe" + n.to_bytes(4, "little")
    return b"\xff" + n.to_bytes(8, "little")
```

The **txid** is the double SHA-256 of the serialized transaction, displayed in reverse order:

$$\text{txid} = \text{reverse}(\text{SHA256}(\text{SHA256}(\text{serialized tx})))$$

```python-sandbox
import hashlib

def double_sha256(data):
    return hashlib.sha256(hashlib.sha256(data).digest()).digest()

raw = bytes.fromhex("0200000001")  # example fragment
txid = double_sha256(raw)[::-1]
print("txid (example):", txid.hex())
---
txid (example): 8f4b4e3c2a1d0e9f7b6a5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e
```

> [!TIP]
> When signing a transaction, a modified variant is serialized (without `script_sig` in the inputs, with `SIGHASH` flags). We will see that when creating and validating transactions.
