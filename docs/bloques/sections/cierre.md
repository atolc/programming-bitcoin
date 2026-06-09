<!-- order: 5 -->

## Cierre

Los bloques son el mecanismo que ordena y confirma transacciones en el tiempo.

Lo esencial:

- La **coinbase** crea nuevos satoshis y cobra comisiones; es siempre la primera transacción.
- El **encabezado** de 80 bytes resume la cadena (`prev_block`), las transacciones (`merkle_root`) y los parámetros de minería (`bits`, `nonce`).
- La **prueba de trabajo** obliga a que el hash del encabezado quede por debajo del target.

En **Networking** verás cómo los nodos intercambian estos encabezados y el resto de mensajes de la red P2P de Bitcoin.
