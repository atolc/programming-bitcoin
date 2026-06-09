<!-- order: 1 -->

## Chapter Map

SegWit (Segregated Witness) separates signature data from the rest of the transaction, reduces the malleability problem, and increases effective block capacity.

By the end of this chapter you will be able to:

- Distinguish p2wpkh, p2sh-p2wpkh, p2wsh, and p2sh-p2wsh.
- Explain the witness field and the new transaction weight.
- Describe the additional improvements brought by the soft fork.

## Complete Coverage Notes

### Motivation and malleability
SegWit separates witness data from the legacy transaction serialization. This fixes the common form of transaction malleability where script_sig changes alter the txid. Legacy nodes see a compatible stripped transaction, while upgraded nodes validate the witness commitment and witness programs.

### Native p2wpkh
A p2wpkh output is version 0 with a 20-byte public-key hash. The script_sig is empty when spending. The witness stack contains signature and SEC public key. Validation reconstructs the classic P2PKH scriptcode for signing, but the signature data is outside the txid.

### Nested p2sh-p2wpkh
For compatibility, a p2wpkh witness program can be wrapped inside P2SH. The script_pubkey is P2SH; script_sig only reveals the redeem script OP_0 <20-byte-hash>; witness carries signature and public key. This gives legacy-looking addresses while still using witness validation.

### p2wsh and p2sh-p2wsh
P2WSH uses a 32-byte SHA256 of a witness script. The witness stack supplies arguments plus the full witness script. Nested P2SH-P2WSH places OP_0 <32-byte-hash> inside a redeem script. This supports complex scripts such as multisig with lower witness weight.

### Other improvements
SegWit introduces block weight, witness commitment in the coinbase, new digest rules from BIP143, script versioning for future upgrades, and a cleaner path for second-layer protocols. A complete implementation distinguishes txid from wtxid, serializes marker and flag, parses witness stacks, and computes signature hashes with previous output amounts.

