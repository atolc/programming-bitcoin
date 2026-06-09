<!-- order: 5 -->

## Cierre

SPV reduce drásticamente los recursos necesarios para aceptar pagos en Bitcoin.

Lo esencial:

- Solo necesitas **encabezados** con PoW válido para seguir la cadena honesta.
- El **árbol de Merkle** resume todas las transacciones en un solo hash de 32 bytes.
- Un **merkleblock** entrega la prueba parcial que tu wallet necesita.

En **Filtros Bloom** verás cómo pedir al nodo solo los merkleblocks y transacciones que probablemente te conciernen, sin revelar todas tus direcciones.

## Complemento de sección

SPV combina proof of work de headers con pruebas Merkle de inclusión. Los headers muestran que mineros comprometieron trabajo a un bloque; las pruebas Merkle muestran que una transacción es parte de ese bloque. Juntos dan a clientes ligeros una ruta práctica de verificación.

La pieza faltante es descubrimiento: ¿cómo pide una wallet transacciones relevantes sin revelar exactamente cada dirección que posee? El capítulo de filtros Bloom responde ese enfoque histórico y sus costos.

