<!-- order: 5 -->

## Connecting to the Network

A new node needs to **discover peers**. The main ways are:

- **DNS seeds**: community-maintained domains that resolve to IPs of active nodes.
- **Known peers**: persisted list of previous successful connections.
- **P2P advertisement**: after connecting, a peer can share addresses of other nodes (`addr`).

Typical flow in Python:

```python-sandbox
import socket

def connect(host: str, port: int = 8333, timeout: float = 10.0):
    sock = socket.create_connection((host, port), timeout=timeout)
    sock.settimeout(None)
    return sock

# Conceptual example (does not connect without a real peer)
print("Mainnet P2P port:", 8333)
print("After TCP, send version and wait for verack")
```

On testnet the default port is **18333**; on regtest, **18444**. After the handshake, the node usually sends `getaddr` or waits for `inv` messages from the peer.

> [!TIP]
> Limit the number of outbound connections (Bitcoin Core uses 8 by default) so you do not saturate your bandwidth or the network. Inbound connections require your firewall to allow the P2P port.
