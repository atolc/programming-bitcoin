<!-- order: 5 -->

## Cierre

Los bloques son el mecanismo que ordena y confirma transacciones en el tiempo.

Lo esencial:

- La **coinbase** crea nuevos satoshis y cobra comisiones; es siempre la primera transacción.
- El **encabezado** de 80 bytes resume la cadena (`prev_block`), las transacciones (`merkle_root`) y los parámetros de minería (`bits`, `nonce`).
- La **prueba de trabajo** obliga a que el hash del encabezado quede por debajo del target.

En **Networking** verás cómo los nodos intercambian estos encabezados y el resto de mensajes de la red P2P de Bitcoin.

## Complemento de sección

Los bloques combinan selección de transacciones, recompensa minera, compromiso Merkle, enlace de cadena y proof of work. Un nodo puede validar el encabezado rápidamente y luego validar transacciones y raíz Merkle para verificación completa del bloque.

El siguiente capítulo usa headers como objetos de red. Cuando puedes parsear y validar localmente un encabezado de 80 bytes, pedir muchos headers a peers se vuelve una estrategia de sincronización, no solo un ejercicio de networking.

