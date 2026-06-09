<!-- order: 2 -->

## Transaction Validation

A full node verifies each transaction before accepting it into the mempool or a block. The main steps:

1. **Syntax**: well-formed fields, sizes within limits.
2. **UTXOs**: each input references an existing, unspent UTXO.
3. **Values**: $\sum \text{inputs} \geq \sum \text{outputs}$ (non-negative fee).
4. **Script**: successful execution of `script_sig || script_pubkey`.
5. **Signature**: `OP_CHECKSIG` validates the signature over the correct digest.

For P2PKH, the script flow is deterministic: signature + public key in `script_sig`, hash embedded in `script_pubkey`.

```python-sandbox
checks = {
    "syntax OK": True,
    "UTXO exists": True,
    "values balance": True,
    "script executes": True,
    "valid signature": True,
}
valid = all(checks.values())
print("Valid transaction:", valid)
for k, v in checks.items():
    print(f"  {k}: {'✓' if v else '✗'}")
```

> [!TIP]
> Validation is **stateless** per transaction: it does not need full history beyond the UTXO set. That makes it possible to validate millions of transactions quickly.
