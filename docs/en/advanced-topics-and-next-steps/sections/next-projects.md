<!-- order: 4 -->

## Suggested Projects

Consolidate what you have learned with small but complete projects:

1. **Minimal SPV client** — Connect to testnet, download headers, verify Merkle proofs for a known tx.
2. **Toy miner** — Search for a valid nonce on regtest with low difficulty; print hashes per second.
3. **Block parser** — Read Bitcoin Core `blk*.dat` files and list txids and coinbase.
4. **HD wallet** — Derive BIP32 keys, generate p2wpkh addresses, and sign a testnet tx.
5. **Local explorer** — HTTP API that queries your node via RPC and shows recent blocks.

```python-sandbox
projects = {
    "spv_client": "headers + merkleblock",
    "toy_miner": "regtest + PoW loop",
    "block_parser": "blk.dat reader",
}
for name, scope in projects.items():
    print(f"{name}: {scope}")
```

Start with **regtest** or **testnet**: you can mine blocks instantly and do not risk real funds. Use `bitcoin-cli` or your own serialization to compare results byte by byte.

> [!TIP]
> Publish the code on GitHub with a README and tests. Explaining out loud how you validate a transaction is one of the best checks that you truly understand the flow.
