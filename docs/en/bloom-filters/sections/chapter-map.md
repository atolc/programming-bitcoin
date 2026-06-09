<!-- order: 1 -->

## Chapter Map

Bloom filters let a lightweight client request only the transactions it cares about, without revealing all its addresses to the full node.

By the end of this chapter you will be able to:

- Explain false positives and why there are no false negatives (when configured correctly).
- Load a filter according to BIP37.
- Relate Bloom filters to Merkle blocks.

## Complete Coverage Notes

### Bloom filter concept
A Bloom filter is a probabilistic set. Adding an item sets several bit positions derived from independent hash functions. Querying checks the same positions. If any bit is zero, the item is definitely absent; if all are one, the item may be present. False positives are expected; false negatives should not occur if the same parameters are used.

### Hash functions and sizing
The chapter derives several hash functions from Murmur3 using a tweak and function index. Filter size and function count trade bandwidth against privacy. A too-small filter leaks patterns and causes too many false positives; a too-large filter reveals interest too precisely.

### BIP37 messages
BIP37 defines filterload, filteradd, and filterclear. Filterload sends the bit field, number of hash functions, tweak, and update flags. Nodes that support bloom filtering can then send matching merkle blocks and relevant transactions. Modern Bitcoin Core limits or disables this service by default for privacy and DoS reasons, but it remains important historically and educationally.

### Merkle blocks and transactions
With a filter loaded, the wallet requests filtered blocks using getdata with MSG_FILTERED_BLOCK or related inventory types. The peer returns a merkleblock plus matching tx messages. The wallet verifies the merkle proof against known headers and then inspects the transactions locally.

### Implementation checklist
A complete Bloom filter module computes bit positions with Murmur3, serializes the bit field little-endian by byte, builds filterload payloads, supports filteradd/filterclear behavior conceptually, requests merkle blocks, and accounts for privacy leakage from repeated queries.

