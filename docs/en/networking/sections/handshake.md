<!-- order: 4 -->

## Network Handshake

Before exchanging blocks or transactions, two nodes complete a **handshake**:

1. The initiator sends `version` with: protocol version, services, timestamp, addresses, connection nonce, user chain height (`start_height`), etc.
2. The receiver responds with its own `version`.
3. Both send `verack` to confirm they accept the connection.

Only after `verack` is the connection considered established and messages like `inv`, `getdata`, `tx`, etc. can be sent.

```python-sandbox
class SimplePeer:
    def __init__(self):
        self.connected = False

    def on_version(self):
        self.connected = True
        return "verack"

peer = SimplePeer()
print(peer.on_version())
print("Connected?", peer.connected)
```

The `services` field indicates node capabilities (for example, whether it advertises being a full node with `NODE_NETWORK`). The `nonce` prevents a node from connecting to itself through NAT.

> [!TIP]
> If protocol versions are incompatible, the peer may close the connection after receiving `version`. That is why modern clients negotiate minimum supported versions.

## Section Completion

The handshake establishes that both peers speak compatible protocol versions and are ready to exchange further messages. A peer sends version, receives version, sends verack, and waits for verack. Only after this exchange should higher-level requests such as getheaders or getdata be considered active.

The nonce in version helps detect accidental self-connections. Services announce capabilities, but they are not a guarantee that every request will be honored. Robust clients should handle disconnects, missing responses, and peers with different service flags.

