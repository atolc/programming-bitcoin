<!-- order: 1 -->

## Chapter Map

Creating a transaction is not just filling in fields: you must serialize the signing format, apply `SIGHASH`, build the `script_sig`, and check that nodes will accept it.

By the end of this chapter you will be able to:

- Validate P2PKH transactions step by step.
- Create a transaction that spends a UTXO and pays to a new address.
- Understand the `SIGHASH_ALL` flag and its variants.
- Send and confirm transactions on testnet.

In the next chapter we will generalize scripts with **Pay-to-Script-Hash** (P2SH).
