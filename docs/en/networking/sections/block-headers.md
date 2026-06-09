<!-- order: 6 -->

## Block Headers on the Network

To synchronize the chain without downloading full blocks, a node sends **`getheaders`** indicating from which known hash it wants to continue and a stop hash (`stop_hash`, often zeros).

The peer responds with **`headers`**: a list of chained 80-byte headers. Each header must link to the previous one (`prev_block`) and satisfy PoW rules.

```
getheaders:
  [version]
  [locator count: varint]
    [hash of best known block]
    [previous hash on the chain, optional]
  [stop_hash: 32 bytes]

headers:
  [header count: varint]
    [header 1: 80 bytes]
    [tx_count: varint = 0]   # always 0 in this message
    [header 2: 80 bytes]
    [tx_count: 0]
    ...
```

```python-sandbox
HEADER_SIZE = 80

def validate_chain_link(prev_hash: bytes, header: bytes) -> bool:
    # prev_block is bytes 4:36 of the header
    return header[4:36] == prev_hash

prev = bytes.fromhex("00" * 32)
fake_header = b"\x00" * 4 + prev + b"\x00" * 44
print("Valid link?", validate_chain_link(prev, fake_header))
```

If the `headers` response reaches the message limit (~2000 headers), the client sends another `getheaders` using the last received hash as the new locator.

> [!TIP]
> Validating headers is much lighter than validating full blocks, but an SPV client still needs Merkle proofs to trust specific transactions. That is the topic of the next chapter.

## Section Completion

Headers synchronization uses a block locator: a list of hashes from the client's known chain, usually starting near the tip and stepping backward. The peer finds the most recent common hash and returns headers after it. This lets clients recover from forks and continue from their best known point.

Each header returned by a headers message should link to the previous one and satisfy proof of work. A headers response can contain up to 2000 headers. If the response is full, the client usually asks again starting from the last received header.

