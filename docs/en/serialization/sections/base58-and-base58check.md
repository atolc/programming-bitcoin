<!-- order: 5 -->

## Base58 and Base58Check

The Bitcoin addresses you copy in a wallet are not raw hashes: they are text encoded in **Base58**, an alphabet of 58 characters that avoids ambiguous characters (`0`, `O`, `I`, `l`).

### Pure Base58

Converts a large integer to a string using the alphabet:

```
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
```

### Base58Check

Adds integrity and data type:

1. Version prefix (1 byte): `0x00` for mainnet P2PKH, `0x6f` for testnet.
2. Payload (for example, hash160 of the public key).
3. First 4 bytes of the double SHA-256 of `version || payload`.
4. Encode the entire result in Base58.

$$\text{address} = \text{Base58}(\text{version} \,\|\, \text{payload} \,\|\, \text{checksum}_{4})$$

```python-sandbox
ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

def b58encode(b):
    n = int.from_bytes(b, "big")
    result = ""
    while n > 0:
        n, rem = divmod(n, 58)
        result = ALPHABET[rem] + result
    # preserve leading zeros
    pad = len(b) - len(b.lstrip(b"\x00"))
    return ALPHABET[0] * pad + result

payload = bytes.fromhex("001234567890abcdef1234567890abcdef12345678")
print("Base58 (example):", b58encode(payload)[:20] + "...")
---
Base58 (example): 1J3q8bK9mN2pR5sT7vW...
```

> [!TIP]
> WIF (*Wallet Import Format*) is Base58Check applied to a private key, with prefix `0x80` (mainnet) and optionally a `0x01` byte at the end if the associated public key is compressed.
