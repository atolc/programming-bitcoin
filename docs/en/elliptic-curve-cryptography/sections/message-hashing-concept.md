<!-- order: 8 -->

## Message Hashing

Before signing, the message is passed through a hash function (SHA-256 in Bitcoin). The result $z$ is an integer that enters the signing equation.

```python-sandbox
import hashlib

msg = b"Learning Bitcoin"
z = int.from_bytes(hashlib.sha256(msg).digest(), "big")
print(f"z = {z}")
print(f"bits: {z.bit_length()}")
```

The signature is over the **hash**, not the full message. This fixes the input size and avoids revealing the content in the signing operation.

### Hashes as Integers

ECDSA equations use integers, so the 32-byte SHA-256 digest is interpreted as a big-endian number. Bitcoin often hashes serialized data twice with SHA-256 when it wants a transaction or block identifier, but a single message hash is enough to understand the signing equation.

```python-sandbox
import hashlib

def hash256(data):
    return hashlib.sha256(hashlib.sha256(data).digest()).digest()

data = b"Programming Bitcoin"
digest = hash256(data)
z = int.from_bytes(digest, "big")
print(digest.hex())
print(z)
```
