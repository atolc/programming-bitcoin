<!-- order: 6 -->

## SegWit Encoding

SegWit transactions use the extension marker: `version`, then **`0x00 0x01`** (flag + witness marker), followed by normal inputs/outputs and, at the end, a **witness** for each input.

```
[version: 4]
[marker: 0x00]
[flag: 0x01]
[inputs...]
[outputs...]
[witness per input:
   [num_stack_items: varint]
     [item1: varint len + bytes]
     ...
]
[locktime: 4]
```

The **txid** is computed **without** the witness (as if it were a legacy transaction). The **wtxid** includes the witness and is used in the block's witness Merkle tree.

```python-sandbox
def tx_weight(base_bytes: int, witness_bytes: int) -> int:
    return base_bytes * 4 + witness_bytes

base, witness = 100, 65
print(f"Weight: {tx_weight(base, witness)} vbytes equiv: {tx_weight(base, witness) / 4:.1f}")
```

The effective fee is expressed in **sat/vbyte** using weight divided by 4.

> [!TIP]
> When serializing for signing, each SegWit input uses `SIGHASH_ALL` over the new BIP143 format, which avoids copying scripts from other inputs and reduces malleability.
