<!-- order: 9 -->

## Conclusion

A Bitcoin transaction is a serialized container that connects past UTXOs with future spending conditions.

The essentials:

- **Inputs** reference previous UTXOs and provide spending proof (`script_sig`).
- **Outputs** set amounts and locking conditions (`script_pubkey`).
- **Locktime** and **sequence** add temporal restrictions.
- The **fee** is implicit: inputs minus outputs.

In **Script** you will learn the stack language that enforces those locking and unlocking conditions.
