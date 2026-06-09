<!-- order: 2 -->

## Why Start with Finite Fields?

Bitcoin uses **elliptic curve cryptography** (ECDSA) for creating digital signatures and public keys. These signatures prove that the sender of a transaction owns the private key that allows them to spend their funds, without needing to reveal that key to the rest of the network.

For computers to process and verify these curves in an exact, secure, and deterministic way, we cannot use the school geometry of continuous real numbers. Computers suffer from rounding errors when handling small decimals and infinite numbers, which would break global consensus in Bitcoin.

We need a system where operations are:
1.  **Discrete:** No decimals or approximations.
2.  **Deterministic:** The result must be identical on any computer in the world.
3.  **Exact:** No loss of precision.

A **finite field** provides precisely this. It offers a limited set of integers and defines special rules that guarantee any calculation (even division) results in another integer within the same set.

---
