<!-- order: 7 -->

## Conclusion

Bitcoin's P2P network wraps structured data in messages with checksums and typed commands.

The essentials:

- Every message has **magic**, **command**, **size**, **checksum**, and **payload**.
- The **handshake** `version` / `verack` establishes the session between peers.
- **`getheaders`** / **`headers`** allow efficient synchronization of the block chain.

In **Simplified Payment Verification** you will use those headers together with Merkle proofs to validate transactions without running a full node.
