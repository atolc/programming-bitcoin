<!-- order: 5 -->

## Conclusion

SPV drastically reduces the resources needed to accept Bitcoin payments.

The essentials:

- You only need **headers** with valid PoW to follow the honest chain.
- The **Merkle tree** summarizes all transactions in a single 32-byte hash.
- A **merkleblock** delivers the partial proof your wallet needs.

In **Bloom Filters** you will see how to ask the node for only the merkleblocks and transactions that likely concern you, without revealing all your addresses.

## Section Completion

SPV combines header proof of work with Merkle inclusion proofs. Headers show that miners committed work to a block; Merkle proofs show that a transaction is part of that block. Together they give lightweight clients a practical verification path.

The missing piece is discovery: how does a wallet ask for relevant transactions without revealing exactly every address it owns? The Bloom filter chapter answers that historical approach and its tradeoffs.

