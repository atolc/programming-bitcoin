<!-- order: 5 -->

## Outputs

Each output creates a new UTXO:

```
[amount: 8 bytes, little-endian, in satoshis]
[script_pubkey length: varint]
[script_pubkey: bytes]
```

The **amount** is an unsigned 64-bit integer. One bitcoin is $10^8$ satoshis:

$$1 \text{ BTC} = 100\,000\,000 \text{ satoshis}$$

The **script_pubkey** (*locking script*) defines the conditions to spend those satoshis. Until someone presents a valid `script_sig` (or `script_witness`) that satisfies it, the funds remain locked.

```python-sandbox
btc = 0.001
satoshis = int(btc * 100_000_000)
amount_bytes = satoshis.to_bytes(8, "little")
print(f"{btc} BTC = {satoshis} satoshis")
print("Serialized amount:", amount_bytes.hex())
```

> [!TIP]
> The sum of all outputs can never exceed the sum of inputs. The difference is the miner's fee.

## Section Completion

An output is where Bitcoin value becomes spendable under a new condition. The amount is an unsigned 8-byte little-endian integer measured in satoshis, not BTC. The script_pubkey is length-prefixed script data; it may correspond to a familiar address type, but the raw transaction stores the script, not the address.

Validation checks output amounts carefully. Negative amounts are impossible at the byte level but can appear if code uses signed integers incorrectly. Values above the total money supply or totals that overflow must be rejected. This is why exact integer arithmetic matters throughout transaction parsing.

