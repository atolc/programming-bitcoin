<!-- order: 4 -->

## Loading the Filter

The wallet sends a **`filterload`** message with the serialized filter. From that point on, the peer associates your connection with that Bloom filter.

```
filterload:
  [filter_bytes: varint + bytes of the bit vector]
  [nHashFuncs: 4 bytes]
  [nTweak: 4 bytes]
  [nFlags: 1 byte]
```

After loading the filter, the wallet usually sends **`filteradd`** each time it derives a new key or address, and **`filterclear`** to empty it.

```python-sandbox
def build_filterload(filter_bytes: bytes, n_hash: int, tweak: int, flags: int) -> dict:
    return {
        "command": "filterload",
        "filter_bytes": filter_bytes,
        "nHashFuncs": n_hash,
        "nTweak": tweak,
        "nFlags": flags,
    }

msg = build_filterload(b"\x00" * 8, 5, 42, 0)
print(msg["command"], len(msg["filter_bytes"]))
```

The node only applies the filter to connections that have explicitly loaded it. Without `filterload`, you will keep receiving only generic `inv` messages.

> [!TIP]
> Regenerate the filter periodically or use `filterclear` + `filterload` to limit how much an observer can learn about your set of addresses.

## Section Completion

Loading a filter changes how a peer treats your connection. After filterload, the peer can evaluate transactions and blocks against your filter and send filtered responses. Filteradd updates the filter incrementally; filterclear removes it from the connection.

The serialized filter is a bit field packed into bytes. Be careful about bit order inside each byte. A visually correct binary string can still serialize incorrectly if bit positions are packed in the wrong direction.

