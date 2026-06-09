<!-- order: 6 -->

## Conclusion

Serialization converts cryptographic objects into bytes that the network can transmit and store.

The essentials:

- **Endianness**: little-endian dominates in numeric transaction fields; hashes in explorers are usually displayed in big-endian.
- **SEC**: public keys of 65 bytes (uncompressed) or 33 bytes (compressed).
- **DER**: ECDSA signatures with strict ASN.1 structure.
- **Base58Check**: human-readable addresses with built-in checksum.

In **Transactions** we will apply these formats to read and write Bitcoin's fundamental container: the transaction.
