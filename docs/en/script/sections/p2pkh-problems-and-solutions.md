<!-- order: 8 -->

## P2PKH: Problems and Solutions

**P2PKH** (*Pay-to-Public-Key-Hash*) locks funds to the hash160 of the public key instead of the full key:

$$\text{script\_pubkey} = \texttt{OP\_DUP}\,\|\,\texttt{OP\_HASH160}\,\|\,\text{push}(H_{160})\,\|\,\texttt{OP\_EQUALVERIFY}\,\|\,\texttt{OP\_CHECKSIG}$$

### Problem it solves

In P2PK, the public key is exposed in the `script_pubkey` from the moment funds are received. In P2PKH only the 20-byte hash is revealed; the public key appears in the `script_sig` **only when spending**.

### Validation flow

1. `script_sig` pushes signature and public key.
2. `OP_DUP` duplicates the public key.
3. `OP_HASH160` computes the hash.
4. It is compared with the hash embedded in `script_pubkey` (`OP_EQUALVERIFY`).
5. `OP_CHECKSIG` verifies the signature over the transaction.

```python-sandbox
# Conceptual step-by-step verification
stack = ["sig", "pubkey"]
stack.append(stack[-1])          # OP_DUP
h = "hash160(pubkey)"            # OP_HASH160
stack.append(h)
embedded = "hash160(pubkey)"
assert stack.pop() == embedded     # OP_EQUALVERIFY
valid = "CHECKSIG(sig, pubkey)"  # OP_CHECKSIG
print("Valid spend:", valid)
```

### P2PKH address

The address you share is Base58Check of `0x00 || hash160`, not the raw script.

> [!TIP]
> P2PKH was the dominant standard until SegWit. It remains compatible and widely used in addresses starting with `1` on mainnet.
