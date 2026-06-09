# Chapter 8: Pay-to-Script Hash

Raw arbitrary scripts are awkward: they take up space in the UTXO set and force the payer to know the full logic. P2SH solves this by locking funds to the hash of a redeem script, which is only revealed at spend time.
