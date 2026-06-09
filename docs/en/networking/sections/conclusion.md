<!-- order: 7 -->

## Conclusion

Bitcoin's P2P network wraps structured data in messages with checksums and typed commands.

The essentials:

- Every message has **magic**, **command**, **size**, **checksum**, and **payload**.
- The **handshake** `version` / `verack` establishes the session between peers.
- **`getheaders`** / **`headers`** allow efficient synchronization of the block chain.

In **Simplified Payment Verification** you will use those headers together with Merkle proofs to validate transactions without running a full node.

## Section Completion

This chapter turns local serialization code into peer communication. The same byte-order discipline used for transactions and blocks now applies to message envelopes and payloads. Networking bugs often look like parsing bugs, so separate envelope parsing, payload parsing, and peer state transitions.

The next chapters use this machinery for lightweight verification: request headers, request filtered blocks, and verify proofs locally. A client that cannot frame messages reliably cannot safely do SPV.

