<!-- order: 3 -->

## Análisis del payload

Una vez leído el sobre, el payload se interpreta según el comando. Cada tipo tiene su propio esquema de serialización (varints, strings con prefijo de longitud, listas con contador, etc.).

Ejemplo conceptual para parsear el sobre:

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

En la práctica implementarás funciones `serialize` / `parse` por mensaje: `VersionMessage`, `InvMessage`, `HeadersMessage`, etc. El patrón es siempre el mismo que en transacciones: campos en orden, little-endian salvo hashes mostrados en big-endian al usuario.

> [!TIP]
> Valida siempre el checksum antes de parsear el payload. Un error de transmisión o un peer malicioso podría enviarte bytes corruptos que rompan tu parser.

## Complemento de sección

El parseo de payload depende del comando. El envelope te dice si el mensaje es, por ejemplo, version, verack, ping, getheaders o headers; solo entonces los bytes pueden interpretarse correctamente. Esta separación mantiene la lógica de framing independiente de la lógica de objetos del protocolo.

Los payloads version son especialmente densos: versión de protocolo, servicios, timestamps, direcciones de red, nonce, user agent, altura inicial y flag relay. Trata cada uno como campo tipado con orden de bytes conocido. Adivinar desde texto o dividir strings falla porque Bitcoin P2P es binario.

