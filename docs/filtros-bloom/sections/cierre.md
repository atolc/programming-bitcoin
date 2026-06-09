<!-- order: 7 -->

## Cierre

Los filtros Bloom permiten a wallets SPV reducir tráfico sin listar todas sus direcciones al nodo.

Lo esencial:

- Un filtro Bloom responde «probablemente sí» o «definitivamente no».
- **BIP37** estandariza `filterload`, `filteradd` y `filterclear`.
- Los **merkleblocks** y las **tx** filtradas completan la verificación de pagos.

En **Segwit** verás cómo el testigo (*witness*) cambia el formato de transacciones y cómo eso afecta al peso del bloque y a las comisiones.
