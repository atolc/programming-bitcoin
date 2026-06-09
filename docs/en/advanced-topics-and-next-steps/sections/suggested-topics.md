<!-- order: 2 -->

## Suggested Topics for Further Study

The book covers the core of a node and a wallet; production Bitcoin adds layers worth exploring:

| Topic | Why it matters |
|-------|----------------|
| **Taproot (BIP341/342)** | `bc1p` addresses, Schnorr, MAST, better privacy and efficiency |
| **Lightning Network** | Off-chain payments with HTLC contracts and routing |
| **BIP32 / BIP39 / BIP44** | HD wallets, mnemonics, and key derivation |
| **PSBT (BIP174)** | Partial transaction exchange between signers |
| **Compact blocks (BIP152)** | Efficient block propagation between nodes |
| **Compact filters (BIP157/158)** | Modern alternative to BIP37 for lightweight clients |

```python-sandbox
topics = ["Taproot", "Lightning", "PSBT", "BIP158"]
for i, topic in enumerate(topics, 1):
    print(f"{i}. {topic}")
```

> [!TIP]
> Read the BIPs at [github.com/bitcoin/bips](https://github.com/bitcoin/bips) after implementing the idea in code. The specification and practice reinforce each other.

## Section Completion

The suggested topics extend the same primitives rather than replacing them. Wallets build on keys, addresses, transaction creation, and fee selection. Lightning builds on multisig, timelocks, revocation logic, and transaction chains. Taproot builds on Schnorr signatures, script commitments, and witness versioning.

A useful study path is to choose one topic and trace it back to the chapters already implemented. If the topic cannot be explained in terms of hashes, signatures, scripts, transactions, blocks, and network messages, the missing prerequisite is probably worth reviewing first.

