<!-- order: 8 -->

## Hashing de mensajes

Antes de firmar, el mensaje se pasa por una función hash (SHA-256 en Bitcoin). El resultado $z$ es un entero que entra en la ecuación de firma.

```python-sandbox
import hashlib

msg = b"Aprendiendo Bitcoin"
z = int.from_bytes(hashlib.sha256(msg).digest(), "big")
print(f"z = {z}")
print(f"bits: {z.bit_length()}")
```

La firma es sobre el **hash**, no sobre el mensaje completo. Esto fija el tamaño de entrada y evita revelar el contenido en la operación de firma.

### Hashes como enteros

Las ecuaciones de ECDSA usan enteros, así que el digest SHA-256 de 32 bytes se interpreta como un número big-endian. Bitcoin suele hashear dos veces con SHA-256 cuando necesita un identificador de transacción o bloque, pero un solo hash de mensaje basta para entender la ecuación de firma.

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
