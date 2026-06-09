<!-- order: 8 -->

## Fees

Bitcoin has no explicit fee field. The miner collects the difference:

$$\text{fee} = \sum \text{inputs} - \sum \text{outputs}$$

Example: you spend a UTXO of 100,000 satoshis and create two outputs of 40,000 and 30,000:

$$\text{fee} = 100\,000 - 70\,000 = 30\,000 \text{ satoshis}$$

```python-sandbox
input_total = 100_000
outputs = [40_000, 30_000]
fee = input_total - sum(outputs)
fee_rate = fee / 250  # assuming 250 vbytes
print(f"Fee: {fee} sats ({fee_rate:.1f} sat/vB)")
```

Miners prioritize transactions with a higher **fee rate per vbyte** (sat/vB). Size in vbytes depends on transaction weight (post-SegWit uses *virtual size*).

> [!TIP]
> If $\sum \text{outputs} > \sum \text{inputs}$, the transaction is invalid. If the fee is excessively high, nodes still accept it; if it is too low, it may remain in the mempool indefinitely.

## Section Completion

Fees are not stored in a transaction. They are inferred by subtracting total output value from total input value. Since input values come from previous outputs, fee calculation is impossible from the current transaction alone unless you already have the referenced UTXOs.

A transaction with outputs greater than inputs is invalid; a transaction with an excessive fee may be valid but economically mistaken. Wallet software therefore has two jobs: consensus validation and user-safety checks. The first rejects impossible value creation; the second protects the user from accidentally burning too much value as fees.

