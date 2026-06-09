<!-- order: 8 -->

## Conclusion

SegWit separated signatures from the transaction body and opened the door to more efficient formats.

The essentials:

- **p2wpkh** and **p2wsh** use native witness programs (`bc1...` addresses).
- **p2sh-p2wpkh** and **p2sh-p2wsh** nest SegWit for compatibility with `3...` addresses.
- **Weight** and BIP143 change how blocks are measured and how transactions are signed.

In **Advanced Topics and Next Steps** you will find further study paths: Taproot, Lightning, contributing to the ecosystem, and projects to keep practicing.

## Section Completion

SegWit reorganizes where signature data lives and how it is committed to. The result is reduced malleability, better fee accounting, improved signature hashing, and a path for future script upgrades. The conceptual split between txid and wtxid should be clear before implementing wallet logic.

By the end of this chapter, you should be able to identify native and nested witness templates, serialize witness transactions, and explain why previous output amounts are part of SegWit signature hashes.

