<!-- order: 3 -->

## How Script Works

When spending a UTXO, the node concatenates two scripts and evaluates them as one:

$$\text{full script} = \text{script\_sig} \,\|\, \text{script\_pubkey}$$

1. The `script_sig` runs first (unlocking data: signatures, keys).
2. Then the `script_pubkey` (locking conditions defined when the output was created).
3. If the final result is true, the spend is valid.

This design is the inverse spirit of **Pay-to-Script-Hash**: the `script_pubkey` is fixed when receiving funds; the `script_sig` is provided when spending.

```
script_sig:    <signature> <public key>
script_pubkey: OP_DUP OP_HASH160 <hash> OP_EQUALVERIFY OP_CHECKSIG
```

```python-sandbox
# Simplified P2PKH flow
script_sig = ["signature", "pubkey"]
script_pubkey = ["DUP", "HASH160", "abc123", "EQUALVERIFY", "CHECKSIG"]
full = script_sig + script_pubkey
print("Steps to execute:", len(full))
print("Order:", " -> ".join(full[:3]) + " -> ...")
```

> [!TIP]
> Nodes execute the script in an isolated environment with an operation limit (cost per opcode). A script that is too long or too expensive is rejected before being confirmed in a block.
