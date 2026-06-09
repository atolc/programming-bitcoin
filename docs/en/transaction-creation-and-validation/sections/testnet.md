<!-- order: 4 -->

## Testnet

**Testnet** is a network parallel to mainnet with the same consensus rules but coin with no real value. It is useful for practice without risk.

| Aspect | Mainnet | Testnet |
|---------|---------|---------|
| P2PKH Base58 prefix | `1` (`0x00`) | `m` or `n` (`0x6f`) |
| Currency | Real BTC | tBTC (no value) |
| Difficulty | High | Low |
| Faucets | N/A | Available online |

Typical practice flow:

1. Generate a key pair on testnet.
2. Request tBTC from a faucet.
3. Create and sign a transaction that spends the received UTXO.
4. Broadcast with `sendrawtransaction` to a testnet node.
5. Wait for confirmations on a testnet explorer.

```python-sandbox
NETWORKS = {
    "mainnet": {"p2pkh_prefix": 0x00, "wif_prefix": 0x80},
    "testnet": {"p2pkh_prefix": 0x6f, "wif_prefix": 0xef},
}
for name, cfg in NETWORKS.items():
    print(f"{name}: P2PKH prefix 0x{cfg['p2pkh_prefix']:02x}")
```

> [!TIP]
> Never reuse keys between mainnet and testnet. Use libraries that accept an explicit network parameter to avoid signing on the wrong chain.
