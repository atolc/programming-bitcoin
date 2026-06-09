<!-- order: 1 -->

## Chapter Map

P2SH was the bridge between simple scripts (P2PKH) and the wallet and multisig ecosystem we know today.

By the end of this chapter you will be able to:

- Build unwrapped (*bare*) multisig transactions.
- Use `OP_CHECKMULTISIG` and understand the historical off-by-one quirk.
- Create P2SH addresses and scripts.
- Encode spending a P2SH UTXO step by step.

In the next chapter we will study **Blocks** and how transactions are grouped and confirmed on the chain.

## Complete Coverage Notes

### Bare multisig
Bare multisig places the entire multisignature script directly in the script_pubkey. A typical m-of-n script pushes m, the public keys, n, and OP_CHECKMULTISIG. This works, but it makes outputs large, exposes all spending conditions before the coins move, and forces senders to understand the recipient's full script.

### CHECKMULTISIG quirk
OP_CHECKMULTISIG has a historical off-by-one behavior: it consumes one extra stack element. Spending multisig therefore begins with a dummy zero. Implementations must preserve this behavior for consensus compatibility even though the element is unused.

### P2SH design
P2SH changes the recipient interface. The sender pays to HASH160(redeem_script), encoded as a Base58Check address with the P2SH version byte. The spender later reveals the full redeem script in script_sig. The node first checks that HASH160(redeem_script) matches the hash in script_pubkey, then evaluates the redeem script with the remaining stack items.

### Redeem script discipline
The redeem script is not recoverable from the chain until it is spent. Wallets must store it. Losing the redeem script can make coins unspendable even if the private keys still exist. The signing digest for a P2SH spend uses the redeem script as the script for the input being signed.

### Implementation checklist
A complete P2SH implementation should build redeem scripts, hash them with HASH160, encode P2SH addresses, construct script_pubkey as OP_HASH160 <20-byte-hash> OP_EQUAL, build script_sig with signatures plus redeem script, and evaluate the two-stage P2SH rule.

