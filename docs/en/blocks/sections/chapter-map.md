<!-- order: 1 -->

## Chapter Map

Blocks are the unit in which transactions are confirmed. Here you will see how they are packaged, what metadata they carry, and why mining is costly.

By the end you will be able to:

- Describe the coinbase transaction and the miner reward.
- Parse an 80-byte block header.
- Explain proof of work and the difficulty target.

## Complete Coverage Notes

### Coinbase transactions
Every block begins with a coinbase transaction that creates the block subsidy plus collected fees. Its input does not spend a previous output; instead it uses a null previous hash and index 0xffffffff. The coinbase script_sig can contain miner data, and BIP34 requires the block height to appear at the beginning.

### Block header fields
The 80-byte header contains version, previous block hash, merkle root, timestamp, bits, and nonce. The previous block hash links the chain. The merkle root commits to all transactions. Timestamp is a Unix time with consensus limits. Bits encodes the proof-of-work target compactly. Nonce is one field miners vary while searching.

### Version signaling
The version field has been used for upgrades and signaling. BIP9-style version bits let miners signal readiness for soft forks. Parsing code should preserve the 4-byte value and expose helper checks for relevant bits.

### Proof of work
A block is valid only if double-SHA256(header), interpreted as a little-endian integer, is below the target. The compact bits format stores a coefficient and exponent. Difficulty compares the current target against the easiest target. Retargeting adjusts difficulty every 2016 blocks based on elapsed time, bounded to avoid extreme jumps.

### Implementation checklist
A complete block module parses headers, serializes them exactly, computes block hash, checks proof of work, decodes bits to target, computes difficulty, detects BIP version signaling, parses coinbase height, and verifies the merkle root against transaction hashes.

