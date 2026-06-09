<!-- order: 5 -->

## Hashing de mensajes (concepto)

Las firmas ECDSA operan sobre un hash del mensaje, no sobre el mensaje completo:

```python-sandbox
import hashlib

message = b"Programming Bitcoin"
z = int.from_bytes(hashlib.sha256(message).digest(), "big")
print(f"Mensaje: {message.decode()}")
print(f"Hash z (primeros digitos): {str(z)[:20]}...")
print(f"Longitud del hash: {z.bit_length()} bits")
---
Mensaje: Programming Bitcoin
Hash z (primeros digitos): 958835051435323862...
Longitud del hash: 256 bits
```

> [!WARNING]
> Si el nonce `k` se repite en dos firmas distintas, un atacante puede calcular la llave privada. Por eso Bitcoin usa RFC6979 para generar `k` de forma determinista pero segura.
