<!-- order: 1 -->

## Chapter Map

Creating a transaction is not just filling in fields: you must serialize the signing format, apply `SIGHASH`, build the `script_sig`, and check that nodes will accept it.

By the end of this chapter you will be able to:

- Validate P2PKH transactions step by step.
- Create a transaction that spends a UTXO and pays to a new address.
- Understand the `SIGHASH_ALL` flag and its variants.
- Send and confirm transactions on testnet.

In the next chapter we will generalize scripts with **Pay-to-Script-Hash** (P2SH).

## Complete Coverage Notes

### Validation pipeline
A node validates that every referenced output exists and is unspent, that input values are at least output values, that no amount is negative or above the money supply limit, and that each input's script succeeds. This chapter connects transaction parsing with script evaluation and signature verification.

### Spentness and trusted data
To validate a transaction, code must fetch the previous transaction for each input and locate the referenced output. That output supplies both the amount and the script_pubkey. Relying on a third-party API is convenient for exercises, but a full node minimizes trust by maintaining its own UTXO set.

### Signature hash construction
For legacy P2PKH, each input is signed separately. The signing serialization replaces the current input's script_sig with the previous output's script_pubkey, empties the other inputs' scripts, appends the SIGHASH type, and double-hashes the result. The resulting integer z is what ECDSA signs and verifies.

### Creating a transaction
The practical flow is: choose UTXOs, choose recipient output, choose change output if needed, estimate fees, build an unsigned transaction, compute z for each input, produce DER signatures with SIGHASH_ALL, add SEC public keys, and serialize. Change should go to a fresh address, not back to a reused address.

### Testnet workflow
Testnet lets you practice without real funds. A complete implementation can create a testnet private key, derive an address, receive faucet coins, construct a spend, sign it, serialize it, broadcast it, and inspect confirmation. Errors usually come from wrong byte order, wrong script for the signing digest, missing SIGHASH byte, or bad fee estimation.

