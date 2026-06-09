<!-- order: 4 -->

## DER Signatures

ECDSA signatures are a pair $(r, s)$ of integers. On the Bitcoin network they are encoded with **DER** (*Distinguished Encoding Rules*), a subset of ASN.1.

The structure is:

```
30 [total length]
   02 [length r] [r in big-endian, without unnecessary leading zeros]
   02 [length s] [s in big-endian, without unnecessary leading zeros]
```

Important rules:

- Each integer is preceded by the byte `0x02` (INTEGER type in DER).
- If the first byte of the integer has the high bit set ($\geq 0x80$), `0x00` is prepended so it is not interpreted as negative.
- Redundant leading zeros are removed, except the sign `0x00`.

```python-sandbox
def encode_int(n):
    raw = n.to_bytes((n.bit_length() + 7) // 8, "big")
    if raw[0] & 0x80:
        raw = b"\x00" + raw
    return b"\x02" + bytes([len(raw)]) + raw

r, s = 0x7c4d7d0e, 0x9b5a7c0d
der = b"\x30" + bytes([len(encode_int(r) + encode_int(s))]) + encode_int(r) + encode_int(s)
print("DER:", der.hex())
```

> [!TIP]
> A valid DER signature for Bitcoin must be between 8 and 73 bytes. Signatures with $s$ in the upper half of the curve order are considered invalid since BIP 62 (*low-S* normalization).

### Parsing DER

Parsing DER means checking each marker byte, reading lengths, and converting the integer bytes back to Python integers.

```python-sandbox
def encode_int(n):
    raw = n.to_bytes((n.bit_length() + 7) // 8, "big") or b"\x00"
    raw = raw.lstrip(b"\x00") or b"\x00"
    if raw[0] & 0x80:
        raw = b"\x00" + raw
    return b"\x02" + bytes([len(raw)]) + raw

def der_encode(r, s):
    body = encode_int(r) + encode_int(s)
    return b"\x30" + bytes([len(body)]) + body

def der_parse(sig):
    if sig[0] != 0x30:
        raise ValueError("bad compound marker")
    r_marker = sig[2]
    if r_marker != 0x02:
        raise ValueError("bad r marker")
    r_len = sig[3]
    r = int.from_bytes(sig[4:4 + r_len], "big")
    s_index = 4 + r_len
    if sig[s_index] != 0x02:
        raise ValueError("bad s marker")
    s_len = sig[s_index + 1]
    s = int.from_bytes(sig[s_index + 2:s_index + 2 + s_len], "big")
    return r, s

encoded = der_encode(123456789, 987654321)
print(encoded.hex())
print(der_parse(encoded))
```
