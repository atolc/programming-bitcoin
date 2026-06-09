<!-- order: 5 -->

## Cierre

SPV reduce drásticamente los recursos necesarios para aceptar pagos en Bitcoin.

Lo esencial:

- Solo necesitas **encabezados** con PoW válido para seguir la cadena honesta.
- El **árbol de Merkle** resume todas las transacciones en un solo hash de 32 bytes.
- Un **merkleblock** entrega la prueba parcial que tu wallet necesita.

En **Filtros Bloom** verás cómo pedir al nodo solo los merkleblocks y transacciones que probablemente te conciernen, sin revelar todas tus direcciones.
