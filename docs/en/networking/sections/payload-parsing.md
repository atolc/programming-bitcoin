<!-- order: 3 -->

## Payload Parsing

Once the envelope is read, the payload is interpreted according to the command. Each type has its own serialization scheme (varints, length-prefixed strings, lists with counters, etc.).

Conceptual example for parsing the envelope:

```python-sandbox
import struct
import hashlib

def read_envelope(data: bytes):
    magic, cmd, size, cksum = struct.unpack("<4s12sI4s", data[:24])
    payload = data[24:24 + size]
    expected = hashlib.sha256(hashlib.sha256(payload).digest()).digest()[:4]
    return cmd.rstrip(b"\x00").decode(), len(payload), cksum == expected

cmd, n, ok = read_envelope(b"\xf9\xbe\xb4\xd9" + b"ping\x00\x00\x00\x00\x00\x00\x00\x00" + b"\x08\x00\x00\x00" + b"\x00"*4 + b"\x01"*8)
print(cmd, n, ok)
```

In practice you will implement `serialize` / `parse` functions per message: `VersionMessage`, `InvMessage`, `HeadersMessage`, etc. The pattern is always the same as with transactions: fields in order, little-endian except hashes shown in big-endian to the user.

> [!TIP]
> Always validate the checksum before parsing the payload. A transmission error or a malicious peer could send you corrupt bytes that break your parser.
