<!-- order: 7 -->

## Cierre

Los filtros Bloom permiten a wallets SPV reducir tráfico sin listar todas sus direcciones al nodo.

Lo esencial:

- Un filtro Bloom responde «probablemente sí» o «definitivamente no».
- **BIP37** estandariza `filterload`, `filteradd` y `filterclear`.
- Los **merkleblocks** y las **tx** filtradas completan la verificación de pagos.

En **Segwit** verás cómo el testigo (*witness*) cambia el formato de transacciones y cómo eso afecta al peso del bloque y a las comisiones.

## Complemento de sección

Los filtros Bloom completan el flujo SPV antiguo: los headers dan trabajo de cadena, los merkleblocks dan pruebas de inclusión y los filtros ayudan a descubrir transacciones relevantes. El sistema es práctico pero imperfecto, especialmente en privacidad.

Wallets modernas suelen preferir alternativas como filtros compactos de bloque o modelos asistidos por servidor con otros intercambios de confianza. Aun así, BIP37 es valioso porque enseña cómo estructuras probabilísticas interactúan con el protocolo P2P de Bitcoin.

