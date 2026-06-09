<!-- order: 2 -->

## Lo mas importante

- Bitcoin es una red peer-to-peer: los nodos intercambian mensajes directamente.
- Cada mensaje viaja dentro de un envelope con magic bytes, comando, longitud, checksum y payload.
- Los magic bytes distinguen redes como mainnet y testnet.
- El checksum protege contra payloads corruptos.
- El handshake inicial usa mensajes `version` y `verack`.
- Los nodos anuncian capacidades, altura de bloque y otros datos de conexion.
- Para sincronizar encabezados se usan mensajes como `getheaders` y `headers`.
- Descargar encabezados primero permite verificar cadena de proof-of-work antes de descargar bloques completos.
- El networking exige serializar y parsear payloads con precision byte a byte.
