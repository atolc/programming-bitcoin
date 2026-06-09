<!-- order: 3 -->

## Transaction Creation

Creating a P2PKH transaction follows these steps:

### 1. Select UTXOs

Choose inputs that cover the amount to send plus the desired fee.

### 2. Build outputs

- Output to the recipient (agreed amount).
- Change output to your own address (if there is leftover).

### 3. Compute the signing digest

A special version of the transaction is serialized:

- The `script_sig` of the input you are signing is replaced by the `script_pubkey` of the UTXO being spent.
- Other `script_sig` fields remain empty.
- The `SIGHASH` byte is appended at the end.

$$\text{digest} = \text{SHA256}(\text{SHA256}(\text{tx to sign}))$$

### 4. Sign and assemble

Sign the digest with your private key (ECDSA) and build:

$$\text{script\_sig} = \text{push}(\text{DER signature} + \text{SIGHASH}) \,\|\, \text{push}(\text{SEC public key})$$

```python-sandbox
SIGHASH_ALL = 1

def sighash_byte(flag):
    return bytes([flag])

digest = bytes.fromhex("deadbeef" * 8)  # placeholder
sig_der = bytes.fromhex("3045022100ab" + "00" * 20)
script_sig_len = len(sig_der) + 1 + 33  # signature+sighash + compressed pubkey
print(f"SIGHASH flag: {SIGHASH_ALL}")
print(f"Approx script_sig: {script_sig_len} bytes")
---
SIGHASH flag: 1
Approx script_sig: 108 bytes
```

> [!TIP]
> `SIGHASH_ALL` (value 1) signs all inputs and outputs. Other variants (`SIGHASH_NONE`, `SIGHASH_SINGLE`, combined with `ANYONECANPAY`) allow more flexible contracts but are rare in standard wallets.
