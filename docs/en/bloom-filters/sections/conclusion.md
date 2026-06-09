<!-- order: 7 -->

## Conclusion

Bloom filters let SPV wallets reduce traffic without listing all their addresses to the node.

The essentials:

- A Bloom filter answers "probably yes" or "definitely no".
- **BIP37** standardizes `filterload`, `filteradd`, and `filterclear`.
- **Merkle blocks** and filtered **tx** messages complete payment verification.

In **Segwit** you will see how the witness changes the transaction format and how that affects block weight and fees.

## Section Completion

Bloom filters complete the older SPV workflow: headers provide chain work, merkleblocks provide inclusion proofs, and filters help discover relevant transactions. The system is practical but imperfect, especially for privacy.

Modern wallets often prefer alternatives such as compact block filters or server-assisted models with different trust tradeoffs. Still, BIP37 is valuable because it teaches how probabilistic data structures interact with Bitcoin's P2P protocol.

