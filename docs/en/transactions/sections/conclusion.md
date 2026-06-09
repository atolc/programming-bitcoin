<!-- order: 9 -->

## Conclusion

A Bitcoin transaction is a serialized container that connects past UTXOs with future spending conditions.

The essentials:

- **Inputs** reference previous UTXOs and provide spending proof (`script_sig`).
- **Outputs** set amounts and locking conditions (`script_pubkey`).
- **Locktime** and **sequence** add temporal restrictions.
- The **fee** is implicit: inputs minus outputs.

In **Script** you will learn the stack language that enforces those locking and unlocking conditions.

## Section Completion

At this point you should be able to read a raw legacy transaction as a sequence of typed fields and explain where every byte belongs. The next dependency is Script: transaction fields identify what is being spent, while scripts decide whether the spend is authorized.

Before moving on, test three things: varint parsing at every boundary, txid byte order, and fee calculation using previous outputs. If those are correct, the rest of the transaction chapters have a stable base.

