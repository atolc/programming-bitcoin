<!-- order: 4 -->

## Proof of Work

**Proof of work** requires that the header hash be less than a **target** set by the network. Formally:

$$\text{block\_hash} < \text{target}$$

The `bits` field in the header encodes the target in compact notation (similar to scientific notation). Higher difficulty means a smaller target and a harder search for a valid nonce.

```python-sandbox
def bits_to_target(bits: int) -> int:
    exponent = bits >> 24
    coefficient = bits & 0xffffff
    return coefficient * (256 ** (exponent - 3))

bits = 0x1d00ffff  # genesis block bits
target = bits_to_target(bits)
print(f"Target (first digits): {str(target)[:20]}...")
```

The miner tries different `nonce` values (and can also modify extra data in the coinbase) until obtaining a hash below the target. Verifying a block is cheap: just recalculate the hash and compare.

**Difficulty** adjusts every 2016 blocks (~2 weeks) to maintain an average time of ~10 minutes per block:

$$\text{new\_difficulty} = \text{previous\_difficulty} \times \frac{\text{actual\_time}}{\text{expected\_time}}$$

> [!TIP]
> PoW does not "solve a useful math puzzle": it turns block creation into a probabilistic process costly in energy, which makes rewriting chain history prohibitive without controlling the majority of hashrate.

## Section Completion

Proof of work turns block creation into a costly search and block verification into a cheap check. The target is decoded from bits; a block hash interpreted as a little-endian integer must be less than that target. This comparison is consensus-critical and must use integer arithmetic, not string ordering.

Difficulty is a human-friendly ratio against the easiest target. Retargeting every 2016 blocks adjusts the target based on elapsed time so the average interval trends toward ten minutes. The allowed adjustment is bounded, preventing abrupt difficulty changes from a single period.

