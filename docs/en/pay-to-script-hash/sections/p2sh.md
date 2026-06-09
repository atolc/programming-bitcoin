<!-- order: 4 -->

## P2SH (Pay-to-Script-Hash)

P2SH locks funds to the hash160 of a **redeem script**, not the script itself:

$$\text{script\_pubkey} = \texttt{OP\_HASH160} \,\|\, \text{push}(H_{160}(\text{redeem script})) \,\|\, \texttt{OP\_EQUAL}$$

Advantages:

- The payer only needs a short address (starts with `3` on mainnet).
- Complex logic (multisig, HTLC, etc.) stays hidden until spend time.
- The UTXO set stores a fixed 23-byte script.

When **spending**, the flow is:

1. `script_sig` pushes the redemption data (signatures, etc.) and the full redeem script.
2. `script_pubkey` hashes the redeem script and compares it to the embedded hash.
3. If they match, the redeem script is evaluated as if it were the original `script_pubkey`.

```python-sandbox
redeem_script = "OP_2 pubkey_A pubkey_B OP_2 OP_CHECKMULTISIG"
hash160 = "a1b2c3..."  # hash160(redeem_script)
script_pubkey = f"OP_HASH160 {hash160} OP_EQUAL"
print("P2SH script_pubkey:", script_pubkey)
print("Mainnet address starts with: 3")
```

> [!TIP]
> The Base58Check prefix for P2SH on mainnet is `0x05` (addresses starting with `3`). On testnet it is `0xc4`.

## Section Completion

P2SH moves script complexity from the funding transaction to the spending transaction. The funding output commits only to HASH160(redeem_script). The spend reveals the redeem script and proves that it hashes to the committed value before executing it. This makes the sender's job simple and keeps the UTXO set smaller.

The tradeoff is responsibility for the receiver. Private keys are not enough; the wallet must retain the redeem script. Without it, the spender cannot prove which script was committed to by the P2SH hash.

