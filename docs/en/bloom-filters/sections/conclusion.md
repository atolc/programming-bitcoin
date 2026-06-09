<!-- order: 7 -->

## Conclusion

Bloom filters let SPV wallets reduce traffic without listing all their addresses to the node.

The essentials:

- A Bloom filter answers "probably yes" or "definitely no".
- **BIP37** standardizes `filterload`, `filteradd`, and `filterclear`.
- **Merkle blocks** and filtered **tx** messages complete payment verification.

In **Segwit** you will see how the witness changes the transaction format and how that affects block weight and fees.
