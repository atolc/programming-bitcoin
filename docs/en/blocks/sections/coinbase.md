<!-- order: 2 -->

## Coinbase Transaction

Each block contains one or more transactions. The **first** is always the **coinbase** transaction: it does not consume previous UTXOs and creates new satoshis as the mining reward plus the fees from the other transactions in the block.

Simplified structure:

```
[version]
[1 coinbase input]
  prev_tx: 32 zero bytes
  prev_index: 0xffffffff
  script_sig: arbitrary miner data (block height, message, etc.)
  sequence: 0xffffffff
[output count: usually 1 or more]
[locktime: 0]
```

The sum of coinbase outputs must be **≤** block subsidy + fees. If it exceeds that limit, the block is invalid.

```python-sandbox
BLOCK_SUBSIDY = 50 * 10**8  # 50 BTC in satoshis (genesis block)
fees = 125_000
coinbase_output = BLOCK_SUBSIDY + fees
print(f"Maximum coinbase output: {coinbase_output} sat")
```

Since **BIP34**, miners include the block height at the start of the coinbase `script_sig`. That prevents duplicating identical coinbases across different blocks.

> [!TIP]
> The coinbase `script_sig` is the only place a miner can write an arbitrary message (like the Times headline in the genesis block). It does not affect economic validation, but it must respect block size rules.

## Section Completion

The coinbase transaction is the only transaction in a block that does not spend an earlier output. It creates new coins up to the current subsidy plus the fees from included transactions. Its previous hash is all zeroes and its previous index is 0xffffffff, making it recognizable during parsing.

BIP34 adds the block height to the beginning of the coinbase script_sig. This prevents duplicate coinbase transaction ids across blocks and gives parsers a consensus-relevant field to extract. Coinbase data can include miner messages, but it still has size and validity constraints.

