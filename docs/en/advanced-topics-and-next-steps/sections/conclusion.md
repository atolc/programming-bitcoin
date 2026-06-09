<!-- order: 5 -->

## Conclusion

You have completed the journey through *Programming Bitcoin*: from finite fields and elliptic curves to blocks, the P2P network, SPV, Bloom filters, and SegWit.

The essentials of the whole journey:

- Bitcoin combines **cryptography**, **data structures**, and **economic incentives**.
- Each layer (transaction → script → block → network) builds on the previous one.
- Implementing in Python forces you to understand bytes, not just high-level APIs.

The protocol keeps evolving (Taproot, Lightning, covenant research), but the fundamentals you built here do not expire. Keep reading BIPs, running code on testnet, and when you are ready, contribute back to the community that maintains this decentralized system.

## Section Completion

The book's arc is from arithmetic to networked Bitcoin objects. Finite fields support elliptic-curve signatures; signatures authorize scripts; scripts spend transactions; transactions enter blocks; blocks link through proof of work; network messages let peers exchange all of it.

Continuing well means preserving that stack in your head. When learning an advanced topic, ask which layer it changes and which layers it depends on. That habit keeps new material connected to the implementation you have already built.

