<!-- order: 5 -->

## Base58 y Base58Check

Las direcciones Bitcoin que copias en una wallet no son hashes crudos: son texto codificado en **Base58**, un alfabeto de 58 caracteres que evita caracteres ambiguos (`0`, `O`, `I`, `l`).

### Base58 puro

Convierte un entero grande a una cadena usando el alfabeto:

```
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
```

### Base58Check

Añade integridad y tipo de dato:

1. Prefijo de versión (1 byte): `0x00` para mainnet P2PKH, `0x6f` para testnet.
2. Payload (por ejemplo, hash160 de la llave pública).
3. Primeros 4 bytes del doble SHA-256 de `versión || payload`.
4. Codificar todo el resultado en Base58.

$$\text{dirección} = \text{Base58}(\text{versión} \,\|\, \text{payload} \,\|\, \text{checksum}_{4})$$

```python-sandbox
ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

def b58encode(b):
    n = int.from_bytes(b, "big")
    result = ""
    while n > 0:
        n, rem = divmod(n, 58)
        result = ALPHABET[rem] + result
    # preservar ceros iniciales
    pad = len(b) - len(b.lstrip(b"\x00"))
    return ALPHABET[0] * pad + result

payload = bytes.fromhex("001234567890abcdef1234567890abcdef12345678")
print("Base58 (ejemplo):", b58encode(payload)[:20] + "...")
```

> [!TIP]
> WIF (*Wallet Import Format*) es Base58Check aplicado a una llave privada, con prefijo `0x80` (mainnet) y opcionalmente un byte `0x01` al final si la llave pública asociada es comprimida.

### Helpers de Base58Check

El helper completo agrega el checksum antes de codificar. Decodificar revierte la operación y rechaza cadenas cuyo checksum no coincide.

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
        raise ValueError("checksum de dirección inválido")
    return combined[1:-4]

h160 = bytes.fromhex("00112233445566778899aabbccddeeff00112233")
address = encode_base58_checksum(b"\x00" + h160)
print(address)
print(decode_base58(address).hex())
```
