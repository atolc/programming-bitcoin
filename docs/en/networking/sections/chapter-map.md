<!-- order: 1 -->

## Chapter Map

Bitcoin nodes communicate with binary messages over TCP. This chapter covers the P2P protocol: handshake, message types, and how to request block headers.

By the end you will be able to:

- Describe the structure of a network message.
- Explain the version / verack handshake.
- Request and receive block headers.

## Complete Coverage Notes

### Network envelope
Bitcoin P2P messages are wrapped in an envelope: magic bytes, 12-byte command, payload length, checksum, and payload. Magic bytes prevent mixing mainnet, testnet, and regtest traffic. The checksum is the first four bytes of double-SHA256(payload). Commands are null-padded ASCII.

### Payload parsing
Every command has its own payload format. Version messages include protocol version, services, timestamp, network addresses, nonce, user agent, latest block height, and relay preference. Verack has no payload. Ping and pong carry nonces. Getheaders and headers use compact-size counts and block locator hashes.

### Handshake
A connection starts with version and verack exchange. After both peers acknowledge compatibility, they can request inventory, transactions, blocks, or headers. The nonce helps detect self-connections. Services advertise capabilities such as full block serving or bloom filter support.

### Header synchronization
A lightweight client can request headers with getheaders by sending a block locator and stop hash. The peer returns up to 2000 headers, each followed by a transaction count that must be zero in a headers message. The client validates linkage and proof of work before asking for more.

### Implementation checklist
A complete networking layer parses envelopes, validates magic and checksums, serializes commands with correct padding, performs the version/verack handshake, sends getheaders, parses headers responses, and keeps network constants separate for mainnet, testnet, and regtest.

