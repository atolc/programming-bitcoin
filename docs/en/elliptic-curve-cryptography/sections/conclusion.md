<!-- order: 9 -->

## Conclusion

You have connected elliptic curves with finite fields, scalar multiplication, secp256k1, and the ECDSA scheme.

Summary:

- Points live in $F_p$ and are added with modular formulas.
- The public key is $eG$; signing uses a nonce $k$ and produces $(r, s)$.
- The message hash is the real cryptographic input.

In **Serialization** we will see how keys and signatures are encoded in the SEC, DER, and Base58 formats you see in addresses and transactions.
