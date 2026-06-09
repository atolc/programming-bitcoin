<!-- order: 2 -->

## Transaction Components

Every Bitcoin transaction follows the same binary template:

```
[version: 4 bytes]
[input count: varint]
  [input 1]
  [input 2]
  ...
[output count: varint]
  [output 1]
  [output 2]
  ...
[locktime: 4 bytes]
```

Each **input** references a previous output (a UTXO) and provides data to prove the right to spend it. Each **output** defines how many satoshis are sent and what script must be satisfied to spend them in the future.

```python-sandbox
# Conceptual scheme
tx = {
    "version": 2,
    "inputs": [{"prev_tx": "abc...", "index": 0, "script_sig": b"", "sequence": 0xffffffff}],
    "outputs": [{"amount": 50000, "script_pubkey": b"76a914..."}],
    "locktime": 0,
}
print(f"Inputs: {len(tx['inputs'])}, Outputs: {len(tx['outputs'])}")
```

> [!TIP]
> A transaction does not contain addresses: it contains **scripts**. Addresses are a human convention derived from the `script_pubkey`.

## Section Completion

A transaction should be read as a transfer of control over UTXOs, not as an account-to-account payment. The important invariant is conservation of value: every spend consumes existing outputs and creates new outputs whose total value is lower by the fee. This is why validation needs previous transactions, not only the bytes of the transaction being parsed.

When implementing this section, keep the four top-level fields mentally separate from the referenced data they imply. Version, inputs, outputs, and locktime are serialized in the transaction; previous output amounts and locking scripts are fetched from the UTXO set. Confusing those two layers is the usual source of incorrect fee calculation and signature validation.

