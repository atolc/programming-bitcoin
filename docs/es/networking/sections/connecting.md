<!-- order: 5 -->

## Conexión a la red

Un nodo nuevo necesita **descubrir peers**. Las vías principales son:

- **DNS seeds**: dominios mantenidos por la comunidad que resuelven a IPs de nodos activos.
- **Peers conocidos**: lista persistida de conexiones previas exitosas.
- **Anuncio P2P**: tras conectarse, un peer puede compartir direcciones de otros nodos (`addr`).

Flujo típico en Python:

```python-sandbox
import socket

def connect(host: str, port: int = 8333, timeout: float = 10.0):
    sock = socket.create_connection((host, port), timeout=timeout)
    sock.settimeout(None)
    return sock

# Ejemplo conceptual (no conecta sin un peer real)
print("Puerto mainnet P2P:", 8333)
print("Tras TCP, enviar version y esperar verack")
```

En testnet el puerto por defecto es **18333**; en regtest, **18444**. Tras el handshake, el nodo suele enviar `getaddr` o esperar mensajes `inv` del peer.

> [!TIP]
> Limita el número de conexiones salientes (Bitcoin Core usa 8 por defecto) para no saturar tu ancho de banda ni la red. Las conexiones entrantes requieren que tu firewall permita el puerto P2P.
