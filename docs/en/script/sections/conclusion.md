<!-- order: 10 -->

## Conclusion

Script is the guardian of every satoshi: a stack interpreter that verifies signatures, hashes, and logical conditions in microseconds.

The essentials:

- Validation concatenates `script_sig` and `script_pubkey`.
- **Opcodes** manipulate a stack with strict rules and no loops.
- **P2PKH** improved privacy and compacted outputs compared to P2PK.
- Arbitrary scripts are possible but have size and cost limits.

In **Transaction Creation and Validation** you will sign real UTXOs, compute the digest with `SIGHASH`, and test everything on testnet.

## Section Completion

The core achievement of this chapter is connecting transaction fields to authorization. Transactions identify previous outputs; Script proves the spender is allowed to consume them. Once that separation is clear, P2PKH, P2SH, and SegWit become variations on where the commitment and proof data live.

Before continuing, make sure your Script implementation can parse data pushes, serialize commands, evaluate stack operations, and call signature verification with an external z. The next chapter depends on all four.

