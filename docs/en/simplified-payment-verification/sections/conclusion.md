<!-- order: 5 -->

## Conclusion

SPV drastically reduces the resources needed to accept Bitcoin payments.

The essentials:

- You only need **headers** with valid PoW to follow the honest chain.
- The **Merkle tree** summarizes all transactions in a single 32-byte hash.
- A **merkleblock** delivers the partial proof your wallet needs.

In **Bloom Filters** you will see how to ask the node for only the merkleblocks and transactions that likely concern you, without revealing all your addresses.
