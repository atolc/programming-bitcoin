<!-- order: 1 -->

## Chapter Map

You have covered the stack from finite fields to SegWit. This closing chapter suggests topics to explore further, ways to contribute to the ecosystem, and practical projects to keep learning.

By the end you will have a clear roadmap for continuing beyond this material.

## Complete Coverage Notes

### Topics to study next
After building the core pieces, the natural next topics are wallets, hierarchical deterministic key derivation, mnemonic seeds, payment channels, Lightning, compact block filters, Taproot, Schnorr signatures, Miniscript, descriptor wallets, and node operations. These topics build on the same primitives: hashes, finite fields, signatures, scripts, transactions, blocks, and network messages.

### Contributing to implementations
The chapter points to real projects rather than more theory. Bitcoin Core is the reference implementation. Other ecosystems include btcd, bcoin, bitcoinj, bitcoinjs-lib, python-bitcoinlib, rust-bitcoin, libbitcoin, Electrum, and BTCPay Server. Useful contributions include tests, documentation, wallet tooling, review, reproducible builds, and small bug fixes.

### Suggested projects
Practical next projects include a block parser, transaction indexer, testnet wallet, script debugger, SPV client, fee estimator, descriptor-based wallet, regtest playground, Lightning invoice parser, or compact filter scanner. Each project should be tested against known vectors and compared byte-for-byte against Bitcoin Core where possible.

### Learning posture
The important habit is to keep reducing trust. Start with third-party APIs if needed, then replace them with local parsing, local verification, local UTXO data, and eventually a full node. Bitcoin programming rewards exactness: byte order, serialization, consensus flags, and edge cases matter as much as the high-level idea.

