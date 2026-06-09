<!-- order: 2 -->

## Motivation

A **full node** stores the entire blockchain, validates every script, and maintains the UTXO set. That offers maximum security, but demands a lot of disk, RAM, and bandwidth.

**Simplified Payment Verification** (SPV) allows a wallet to:

1. Download only **block headers** (80 bytes each).
2. Verify the **accumulated proof of work** of the chain.
3. Obtain a **Merkle proof** that a transaction is in a specific block.

```python-sandbox
FULL_NODE_GB = 600
SPV_HEADERS_MB = 60  # ~800k blocks x 80 bytes
print(f"Full node: ~{FULL_NODE_GB} GB")
print(f"Headers only: ~{SPV_HEADERS_MB} MB")
```

SPV assumes the chain with the most accumulated work is the correct one. It does not detect invalid transactions on its own that never made it into a mined block, but it can verify that a payment was **included** in a confirmed block.

> [!TIP]
> SPV trusts that miners do not collude to hide transactions included in blocks they do show you. For large amounts, many wallets query several nodes or use your own full node.

## Section Completion

SPV exists because storing and validating every full block is expensive for small devices. A lightweight client downloads headers, verifies proof of work, and asks for evidence that relevant transactions are included. This is much stronger than trusting a server response, but weaker than full validation.

The security assumption is precise: SPV trusts that the chain with sufficient proof of work is economically difficult to fake, but it does not validate every transaction rule inside each block. It verifies inclusion, not complete block correctness.

