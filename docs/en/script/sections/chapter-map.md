<!-- order: 1 -->

## Chapter Map

Script is Bitcoin's authorization mechanism: every satoshi is protected by a short program that only runs when it is spent.

By the end of this chapter you will be able to:

- Describe stack mechanics and the execution flow.
- Interpret common opcodes.
- Parse and combine script fields.
- Build P2PK and P2PKH scripts.
- Understand why arbitrary scripts exist and their limitations.

In the next chapter we will put Script into practice by creating and validating complete transactions.

## Complete Coverage Notes

### Execution model
Script is a stack language. The unlocking script runs first and leaves data on the stack; the locking script then consumes that data and must leave a truthy top element. There is no global state, no loops in standard validation, and every opcode either manipulates the stack, hashes data, compares values, or verifies signatures.

### Opcodes and examples
The chapter walks from simple opcodes such as OP_DUP, OP_HASH160, OP_EQUAL, OP_EQUALVERIFY, OP_ADD, and OP_CHECKSIG to complete standard scripts. Small integers have special opcodes, byte pushes from 1 to 75 bytes use the length as the opcode, and longer pushes use OP_PUSHDATA1, OP_PUSHDATA2, or OP_PUSHDATA4.

### Parsing and serializing scripts
A Script object is a list of commands, where each command is either an integer opcode or raw bytes. Parsing must distinguish opcode bytes from data pushes and then read exactly the announced number of bytes. Serialization must emit the shortest valid push form. The script field in a transaction is itself length-prefixed, so script parsing and transaction parsing are tightly connected.

### Standard scripts
The chapter covers pay-to-pubkey, pay-to-pubkey-hash, pay-to-script-hash, pay-to-witness-pubkey-hash, and pay-to-witness-script-hash as a progression. P2PK exposes the public key immediately. P2PKH stores HASH160(public key) and reveals the public key only when spending. P2SH and witness programs move complexity out of the UTXO set and into spending data.

### Validation checklist
To evaluate scripts, concatenate script_sig and script_pubkey for legacy scripts, execute commands in order, handle failed opcodes immediately, and treat empty stack or false top element as failure. Signature opcodes need the transaction digest from the signing chapter, so the Script evaluator must accept an externally computed z value.

