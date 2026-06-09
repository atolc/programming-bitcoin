<!-- order: 3 -->

## OP_CHECKMULTISIG

`OP_CHECKMULTISIG` verifies an $m$-of-$n$ scheme:

1. Consumes from the stack: $m$, the $m$ signatures, $n$, and the $n$ public keys.
2. Checks that at least $m$ signatures are valid for the corresponding keys.
3. Pushes `1` (success) or `0` (failure).

### The Off-by-One Bug

Due to an original implementation error, `CHECKMULTISIG` consumes an extra stack element it does not use. The convention is to push `OP_0` (a null byte) at the start of the `script_sig`:

$$\text{script\_sig} = \texttt{OP\_0} \,\|\, \text{push}(\text{sig}_1) \,\|\, \cdots \,\|\, \text{push}(\text{sig}_m)$$

```python-sandbox
# Conceptual stack simulation before CHECKMULTISIG
stack = ["OP_0", "sig_a", "sig_b", "OP_2", "pub_a", "pub_b", "pub_c", "OP_3"]
# CHECKMULTISIG consumes: OP_3, pub_c, pub_b, pub_a, OP_2, sig_b, sig_a, OP_0
consumed = 8
print(f"Elements consumed: {consumed} (includes the dummy OP_0)")
print("Result: 1 if >= 2 valid signatures")
```

> [!TIP]
> This behavior is **intentionally preserved** for backward compatibility. Any modern implementation must include the dummy `OP_0` when signing multisig.
