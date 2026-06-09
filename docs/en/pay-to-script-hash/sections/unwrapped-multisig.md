<!-- order: 2 -->

## Unwrapped Multisig (Bare Multisig)

A **multisig** script requires $m$ valid signatures from a set of $n$ public keys:

$$\texttt{OP\_}m \,\|\, \text{push}(\text{pubkey}_1) \,\|\, \cdots \,\|\, \text{push}(\text{pubkey}_n) \,\|\, \texttt{OP\_}n \,\|\, \texttt{OP\_CHECKMULTISIG}$$

In *bare* (unwrapped) form, this full script goes directly in the `script_pubkey`. When spending, the `script_sig` supplies the signatures and an extra historical byte.

Problems with bare multisig:

- The payer must know all keys and the value $m$.
- The `script_pubkey` is long (many embedded public keys).
- The resulting address does not fit the standard P2PKH format.

```python-sandbox
m, n = 2, 3
pubkeys = [f"pubkey_{i}" for i in range(n)]
bare_script = [f"OP_{m}"] + pubkeys + [f"OP_{n}", "OP_CHECKMULTISIG"]
print("Bare multisig:", " ".join(bare_script))
print(f"Elements in script_pubkey: {len(bare_script)}")
```

> [!TIP]
> Bare multisig is only practical for very simple cases. For everyday payments, P2SH (or SegWit) is the standard.
