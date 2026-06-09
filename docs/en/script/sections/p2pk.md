<!-- order: 7 -->

## P2PK (Pay-to-Public-Key)

The oldest format locks funds directly to a public key:

$$\text{script\_pubkey} = \text{push}(\text{SEC public key}) \,\|\, \texttt{OP\_CHECKSIG}$$

When spending, the `script_sig` only needs the signature:

$$\text{script\_sig} = \text{push}(\text{DER signature})$$

```python-sandbox
# P2PK in hex (scheme)
pubkey = bytes.fromhex("02" + "ab" * 32)  # example compressed SEC
script_pubkey = bytes([len(pubkey)]) + pubkey + bytes([0xac])  # OP_CHECKSIG
print("P2PK script_pubkey:", script_pubkey.hex()[:40] + "...")
print("Size:", len(script_pubkey), "bytes")
```

Satoshi used P2PK in block rewards during the first years. Today it is obsolete for normal payments because:

- It exposes the full public key on-chain (less privacy).
- Scripts are longer than P2PKH for the same purpose.

> [!TIP]
> P2PK remains conceptually relevant: `OP_CHECKSIG` is the heart of almost all later output types.

## Section Completion

P2PK locks coins directly to a public key and asks the spender for a valid signature. It is simple and historically important, but it exposes the public key as soon as the output is created. That is why later standard scripts prefer hashes of public keys until spend time.

Implementation-wise, P2PK is useful because it isolates OP_CHECKSIG. If you can feed OP_CHECKSIG a signature, a SEC public key, and the correct z value, you have the cryptographic core needed for P2PKH and later scripts.

