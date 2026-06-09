<!-- order: 6 -->

## Conclusion

P2SH made multisig and complex contracts practical without burdening the payer.

The essentials:

- **Bare multisig** exposes all logic in the `script_pubkey`; it is impractical.
- **OP_CHECKMULTISIG** requires the dummy `OP_0` byte for historical compatibility.
- **P2SH** locks funds to the hash of the redeem script; logic is revealed at spend time.
- `3...` addresses are P2SH on mainnet; the version prefix is `0x05`.

In **Blocks** you will see how validated transactions are packaged, mined, and chained on the blockchain.
