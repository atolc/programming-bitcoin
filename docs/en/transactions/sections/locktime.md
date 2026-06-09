<!-- order: 6 -->

## Locktime

The **locktime** field (4 bytes, little-endian) at the end of the transaction imposes a time or block height restriction before the transaction is valid in a block.

| Locktime range | Interpretation |
|----------------|----------------|
| $< 500\,000\,000$ | Minimum block height |
| $\geq 500\,000\,000$ | Minimum UNIX timestamp |

A locktime of **0** means the transaction can be included in the next available block.

```python-sandbox
LOCKTIME_THRESHOLD = 500_000_000

def interpret_locktime(lt):
    if lt == 0:
        return "no restriction"
    if lt < LOCKTIME_THRESHOLD:
        return f"block >= {lt}"
    return f"timestamp >= {lt}"

for lt in [0, 250000, 600_000_000]:
    print(f"locktime {lt}: {interpret_locktime(lt)}")
---
locktime 0: no restriction
locktime 250000: block >= 250000
locktime 600000000: timestamp >= 600000000
```

> [!TIP]
> Absolute locktime is complemented by **sequence** and `nSequence` for relative locks (BIP 68/112). An input with `sequence < 0xffffffff` can activate additional rules.
