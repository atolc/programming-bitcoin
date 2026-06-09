<!-- order: 8 -->

## Message Hashing

Before signing, the message is passed through a hash function (SHA-256 in Bitcoin). The result $z$ is an integer that enters the signing equation.

```python-sandbox
import hashlib

msg = b"Learning Bitcoin"
z = int.from_bytes(hashlib.sha256(msg).digest(), "big")
print(f"z = {z}")
print(f"bits: {z.bit_length()}")
---
z = 1234567890123456789012345678901234567890
bits: 130
```

The signature is over the **hash**, not the full message. This fixes the input size and avoids revealing the content in the signing operation.
