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

## Section Completion

Connecting to the network means managing a TCP stream and a Bitcoin message stream at the same time. TCP only provides ordered bytes; your node code must read complete envelopes, parse payloads, and send responses in protocol order. Partial reads are normal and should not be treated as malformed messages.

Network constants matter. Mainnet, testnet, and regtest have different magic bytes and default ports. Accidentally mixing them can produce messages that parse structurally but are invalid for the intended network. Keep network configuration explicit.

