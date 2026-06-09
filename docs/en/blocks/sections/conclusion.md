<!-- order: 5 -->

## Conclusion

Blocks are the mechanism that orders and confirms transactions over time.

The essentials:

- The **coinbase** creates new satoshis and collects fees; it is always the first transaction.
- The **80-byte header** summarizes the chain (`prev_block`), transactions (`merkle_root`), and mining parameters (`bits`, `nonce`).
- **Proof of work** requires the header hash to fall below the target.

In **Networking** you will see how nodes exchange these headers and the rest of the messages on Bitcoin's P2P network.
