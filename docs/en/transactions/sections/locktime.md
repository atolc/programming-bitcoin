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
```

> [!TIP]
> Absolute locktime is complemented by **sequence** and `nSequence` for relative locks (BIP 68/112). An input with `sequence < 0xffffffff` can activate additional rules.

## Section Completion

Locktime is absolute and conditional. Values below 500,000,000 are interpreted as block heights; values at or above that threshold are Unix timestamps. But locktime only has an effect when at least one input has a non-final sequence. If every sequence is 0xffffffff, legacy locktime is ignored.

This field is a good example of consensus context: the same 4 bytes can be meaningless or binding depending on input sequence values and chain height/time. Code should parse locktime mechanically, then leave interpretation to validation logic that has access to the transaction and chain state.

