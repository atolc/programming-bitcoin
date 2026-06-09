<!-- order: 6 -->

## Cierre

La serialización convierte objetos criptográficos en bytes que la red puede transmitir y almacenar.

Lo esencial:

- **Endianness**: little-endian domina en campos numéricos de transacciones; los hashes en exploradores suelen mostrarse en big-endian.
- **SEC**: llaves públicas de 65 bytes (sin comprimir) o 33 bytes (comprimido).
- **DER**: firmas ECDSA con estructura ASN.1 estricta.
- **Base58Check**: direcciones legibles con checksum integrado.

En **Transacciones** aplicaremos estos formatos para leer y escribir el contenedor fundamental de Bitcoin: la transacción.
