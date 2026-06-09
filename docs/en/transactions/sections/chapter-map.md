<!-- order: 1 -->

## Chapter Map

Transactions are the operational heart of Bitcoin: everything else (blocks, mempool, wallets) revolves around creating, validating, and confirming them.

By the end of this chapter you will be able to:

- Identify the components of a transaction (version, inputs, outputs, locktime).
- Read and write fields in binary format.
- Calculate implicit fees.
- Serialize and deserialize transactions in Python.

In the next chapter we will look at **Script**, the mini-language that defines the spending conditions for each output.

## Complete Coverage Notes

### Transaction structure
A transaction spends previous outputs and creates new outputs. The book's chapter is not only about the four visible fields; it also explains the UTXO model behind them. A transaction input points to a previous transaction hash and output index, then provides unlocking data. A transaction output declares an amount in satoshis and a locking script. Nodes validate transactions by checking that every input refers to an existing unspent output, that the unlocking data satisfies the locking script, and that no output creates value out of nothing.

### Binary encoding details
The chapter introduces compact-size integers, usually called varints, because transaction inputs and outputs are variable-length lists. Values below 0xfd use one byte; larger values use marker bytes 0xfd, 0xfe, or 0xff followed by little-endian integers. Transaction hashes are displayed big-endian to humans but serialized internally little-endian, so parsing code must reverse hashes at the right boundary.

### Inputs, outputs, and scripts
Each input contains previous transaction id, previous output index, script_sig length, script_sig, and sequence. Each output contains amount, script_pubkey length, and script_pubkey. The transaction does not store addresses. Addresses are wallet-level encodings of scripts or script hashes. When debugging, inspect scripts and byte lengths instead of assuming an address exists in the raw transaction.

### Sequence, locktime, and fees
Sequence defaults to 0xffffffff. Non-final sequence values can activate replacement and relative locktime rules. Locktime is ignored unless at least one input has a non-final sequence. Fees are implicit: total input amount minus total output amount. Since the input amounts live in previous transactions, fee calculation requires looking up the referenced UTXOs.

### Implementation checklist
A complete implementation should parse and serialize varints, transaction inputs, transaction outputs, locktime, and full transactions; preserve byte order consistently; compute the transaction id as double-SHA256 of the serialized transaction reversed for display; and calculate fees only after fetching previous outputs.

