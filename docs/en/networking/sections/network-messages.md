<!-- order: 2 -->

## Network Messages

Communication between Bitcoin nodes uses binary messages with a fixed **envelope** followed by a variable **payload**:

```
[magic: 4 bytes]     # identifies the network (mainnet, testnet, regtest)
[command: 12 bytes]  # ASCII name padded with zeros (e.g. "version")
[payload_size: 4]    # payload length in little-endian
[checksum: 4]        # first 4 bytes of SHA256(SHA256(payload))
[payload: variable]
```

Common commands:

| Command | Purpose |
|---------|---------|
| `version` / `verack` | Protocol handshake |
| `inv` | Inventory of available hashes |
| `getdata` | Request specific objects |
| `tx` / `block` | Transmit transaction or block |
| `getheaders` / `headers` | Synchronize chain via headers |

```python-sandbox
NETWORK_MAGIC = b"\xf9\xbe\xb4\xd9"  # mainnet
command = b"version".ljust(12, b"\x00")
payload_size = (0).to_bytes(4, "little")
checksum = b"\x00" * 4
envelope = NETWORK_MAGIC + command + payload_size + checksum
print(f"Minimum envelope: {len(envelope)} bytes")
```

> [!TIP]
> The `magic` prevents accidentally connecting to another network or a TCP service that is not Bitcoin. Testnet uses `0x0b110907`; regtest uses `0xdab5bffa`.
