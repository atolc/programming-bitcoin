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
