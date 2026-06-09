<!-- order: 5 -->

## Conclusion

Creating and validating transactions closes the loop between theory and practice in Bitcoin.

The essentials:

- **Validation** checks UTXOs, values, scripts, and signatures.
- **Creation** requires serializing the signing format with `SIGHASH`.
- The **script_sig** provides signature + public key to unlock P2PKH.
- **Testnet** lets you practice the full flow at no economic cost.

In **Pay-to-Script Hash** you will see how to hide complex scripts behind a hash, enabling multisig and more elaborate contracts.
