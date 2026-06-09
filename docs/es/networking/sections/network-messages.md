<!-- order: 2 -->

## Mensajes de red

La comunicación entre nodos Bitcoin usa mensajes binarios con un **sobre** fijo seguido de un **payload** variable:

```
[magic: 4 bytes]     # identifica la red (mainnet, testnet, regtest)
[command: 12 bytes]  # nombre ASCII rellenado con ceros (ej. "version")
[payload_size: 4]    # longitud del payload en little-endian
[checksum: 4]        # primeros 4 bytes de SHA256(SHA256(payload))
[payload: variable]
```

Comandos habituales:

| Comando | Propósito |
|---------|-----------|
| `version` / `verack` | Handshake de protocolo |
| `inv` | Inventario de hashes disponibles |
| `getdata` | Solicitar objetos concretos |
| `tx` / `block` | Transmitir transacción o bloque |
| `getheaders` / `headers` | Sincronizar cadena por encabezados |

```python-sandbox
NETWORK_MAGIC = b"\xf9\xbe\xb4\xd9"  # mainnet
command = b"version".ljust(12, b"\x00")
payload_size = (0).to_bytes(4, "little")
checksum = b"\x00" * 4
envelope = NETWORK_MAGIC + command + payload_size + checksum
print(f"Sobre minimo: {len(envelope)} bytes")
---
Sobre minimo: 24 bytes
```

> [!TIP]
> El `magic` evita conectar accidentalmente a otra red o a un servicio TCP que no sea Bitcoin. Testnet usa `0x0b110907`; regtest usa `0xdab5bffa`.
