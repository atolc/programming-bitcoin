<!-- order: 1 -->

## Chapter Map

A lightweight client does not download the entire chain. Simplified Payment Verification (SPV) uses Merkle trees to verify that a transaction is in a block without storing all full blocks.

By the end you will be able to:

- Build a Merkle tree and compute its root.
- Explain why SPV trusts miners for headers.
- Describe the format of a Merkle block.

## Complete Coverage Notes

### SPV security model
Simplified Payment Verification trusts proof of work on headers and uses Merkle proofs for inclusion. It does not independently validate every transaction, so it assumes the strongest valid header chain represents miner consensus. SPV can show that a transaction is included in a block, but not that every rule inside the block was independently checked.

### Merkle construction
A merkle parent is HASH256(left || right). A parent level hashes pairs of transaction hashes; if a level has an odd count, the final hash is duplicated. Repeating this process gives the merkle root stored in the block header. Transaction hashes are handled in internal byte order when computing the tree.

### Merkle root in blocks
The merkle root commits to transaction order and content. If any transaction changes, the path to the root changes and the block header hash changes. A complete block verifier recomputes the root from all transaction hashes and compares it with the header.

### Partial merkle trees
A merkleblock message contains a header, total transaction count, a list of hashes, and flag bits. The flags tell the parser when to descend and when to consume a provided hash. The result is a reconstructed partial tree whose root must equal the header's merkle root.

### Implementation checklist
A complete SPV module computes merkle parents, parent levels, and roots; handles odd leaves correctly; parses merkleblock messages; walks flag bits and hashes deterministically; extracts matched transaction hashes; and rejects proofs whose reconstructed root does not match the block header.

