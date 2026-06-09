<!-- order: 6 -->

## Transactions of Interest

When a transaction in the block matches the Bloom filter, the node sends it in **`tx`** messages in addition to the `merkleblock`. The wallet:

1. Verifies the Merkle proof (transaction included in the block).
2. Inspects inputs and outputs to see if they affect its addresses.
3. Updates the local balance and history.

```python-sandbox
def affects_wallet(tx_outputs, watched_scripts: set) -> bool:
    return any(script in watched_scripts for script in tx_outputs)

watched = {b"\x76\xa9\x14" + b"pubkeyhash"}
outputs = [b"\x76\xa9\x14" + b"pubkeyhash", b"\x00\xa9\x14" + b"other"]
print("Affects us?", affects_wallet(outputs, watched))
```

Bloom filter **false positives** cause you to receive unrelated `tx` messages occasionally. The wallet discards them after parsing; the cost is bandwidth, not direct security risk.

For received payments, many wallets wait for several confirmations (more blocks chained afterward) before considering the funds spendable.

> [!TIP]
> Save the `merkleblock` and associated `tx` messages if you want to audit payments offline: with the Merkle proof and the header you can prove inclusion without trusting the node in the future.
