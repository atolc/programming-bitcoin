<!-- order: 4 -->

## Inputs

Each input spends an existing UTXO. Its structure:

```
[previous tx hash: 32 bytes, little-endian internally]
[output index: 4 bytes, little-endian]
[script_sig length: varint]
[script_sig: bytes]
[sequence: 4 bytes, little-endian]
```

The **previous transaction hash** points to the UTXO being consumed. The **index** indicates which output of that transaction is spent (starting at 0).

The **script_sig** contains the authorization proof: signatures, public keys, or other data depending on the script type.

The **sequence** controls replacement (RBF) and relative locktime (BIP 68). The value `0xffffffff` is the default.

```python-sandbox
prev_hash = bytes.fromhex("a1b2c3d4" * 8)  # 32 bytes
index = 0
sequence = 0xffffffff
print(f"Input points to tx {prev_hash[:4].hex()}... output #{index}")
print(f"Sequence: {sequence:#010x}")
---
Input points to tx a1b2c3d4... output #0
Sequence: 0xffffffff
```

> [!TIP]
> The previous tx hash is stored in **reverse** order compared to how explorers display it. If you copy a txid from an explorer, you must reverse the bytes before serializing.
