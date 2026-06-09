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
```

> [!TIP]
> When signing a transaction, a modified variant is serialized (without `script_sig` in the inputs, with `SIGHASH` flags). We will see that when creating and validating transactions.

## Section Completion

Transaction encoding is mostly about respecting boundaries. Version and locktime are fixed-size fields; input and output counts are varints; scripts are byte blobs with their own lengths. A serializer must reproduce the exact bytes, because txid calculation is a hash of the serialized transaction.

The safest implementation pattern is parse, serialize, and compare against the original bytes before adding higher-level helpers. If round-tripping changes byte order, varint width, or script push encoding, later signing and txid tests will fail in ways that are hard to diagnose.

