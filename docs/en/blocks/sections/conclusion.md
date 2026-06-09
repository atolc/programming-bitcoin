<!-- order: 5 -->

## Conclusion

Blocks are the mechanism that orders and confirms transactions over time.

The essentials:

- The **coinbase** creates new satoshis and collects fees; it is always the first transaction.
- The **80-byte header** summarizes the chain (`prev_block`), transactions (`merkle_root`), and mining parameters (`bits`, `nonce`).
- **Proof of work** requires the header hash to fall below the target.

In **Networking** you will see how nodes exchange these headers and the rest of the messages on Bitcoin's P2P network.

## Section Completion

Blocks combine transaction selection, miner reward, merkle commitment, chain linkage, and proof of work. A node can validate the header cheaply, then validate the transactions and merkle root for full block verification.

The next chapter uses headers as network objects. Once you can parse and validate an 80-byte header locally, requesting many headers from peers becomes a synchronization strategy rather than just a networking exercise.

