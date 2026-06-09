<!-- order: 5 -->

## Conclusion

Creating and validating transactions closes the loop between theory and practice in Bitcoin.

The essentials:

- **Validation** checks UTXOs, values, scripts, and signatures.
- **Creation** requires serializing the signing format with `SIGHASH`.
- The **script_sig** provides signature + public key to unlock P2PKH.
- **Testnet** lets you practice the full flow at no economic cost.

In **Pay-to-Script Hash** you will see how to hide complex scripts behind a hash, enabling multisig and more elaborate contracts.

## Section Completion

This chapter closes the loop from bytes to spendable value. You can now parse a transaction, locate previous outputs, compute the signature digest, verify existing spends, and create a new spend. Those abilities are the foundation for wallets and for understanding more advanced script containers.

The next conceptual jump is P2SH, where the script being committed to is hidden behind a hash until spending time. The same signing and validation machinery still applies, but the script source changes.

