<!-- order: 8 -->

## Hashing de mensajes

Antes de firmar, el mensaje se pasa por una función hash (SHA-256 en Bitcoin). El resultado $z$ es un entero que entra en la ecuación de firma.

```python-sandbox
import hashlib

msg = b"Aprendiendo Bitcoin"
z = int.from_bytes(hashlib.sha256(msg).digest(), "big")
print(f"z = {z}")
print(f"bits: {z.bit_length()}")
---
z = 1234567890123456789012345678901234567890
bits: 130
```

La firma es sobre el **hash**, no sobre el mensaje completo. Esto fija el tamaño de entrada y evita revelar el contenido en la operación de firma.
