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
```

> [!TIP]
> WIF (*Wallet Import Format*) is Base58Check applied to a private key, with prefix `0x80` (mainnet) and optionally a `0x01` byte at the end if the associated public key is compressed.

### Base58Check Helpers

The full helper adds the checksum before encoding. Decoding reverses the operation and rejects strings whose checksum does not match.

```python-sandbox
import hashlib

ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

def hash256(data):
    return hashlib.sha256(hashlib.sha256(data).digest()).digest()

def encode_base58(raw):
    count = 0
    for byte in raw:
        if byte == 0:
            count += 1
        else:
            break
    num = int.from_bytes(raw, "big")
    result = ""
    while num:
        num, mod = divmod(num, 58)
        result = ALPHABET[mod] + result
    return "1" * count + result

def encode_base58_checksum(payload):
    return encode_base58(payload + hash256(payload)[:4])

def decode_base58(text):
    num = 0
    for char in text:
        num *= 58
        num += ALPHABET.index(char)
    combined = num.to_bytes(25, "big")
    checksum = combined[-4:]
    if hash256(combined[:-4])[:4] != checksum:
        raise ValueError("bad address checksum")
    return combined[1:-4]

h160 = bytes.fromhex("00112233445566778899aabbccddeeff00112233")
address = encode_base58_checksum(b"\x00" + h160)
print(address)
print(decode_base58(address).hex())
```
