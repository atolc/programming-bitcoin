<!-- order: 1 -->

## Mapa del capítulo

Los nodos de Bitcoin se hablan con mensajes binarios sobre TCP. Este capítulo cubre el protocolo P2P: handshake, tipos de mensaje y cómo pedir encabezados de bloques.

Al terminar podrás:

- Describir la estructura de un mensaje de red.
- Explicar el handshake versión / verack.
- Solicitar y recibir encabezados de bloques.

## Notas de cobertura completa

### Sobre de red
Los mensajes P2P de Bitcoin se envuelven en un envelope: magic bytes, comando de 12 bytes, longitud del payload, checksum y payload. Los magic bytes evitan mezclar mainnet, testnet y regtest. El checksum son los primeros cuatro bytes de doble-SHA256(payload). Los comandos son ASCII rellenado con nulos.

### Parseo de payloads
Cada comando tiene su propio formato. Version incluye versión de protocolo, servicios, timestamp, direcciones de red, nonce, user agent, altura conocida y preferencia de relay. Verack no tiene payload. Ping y pong llevan nonces. Getheaders y headers usan conteos compactos y hashes localizadores.

### Handshake
Una conexión empieza con intercambio version y verack. Después de que ambos peers aceptan compatibilidad, pueden pedir inventario, transacciones, bloques o headers. El nonce ayuda a detectar conexiones a uno mismo. Services anuncia capacidades como servir bloques completos o soportar filtros Bloom.

### Sincronización de headers
Un cliente ligero puede pedir headers con getheaders enviando un block locator y stop hash. El peer devuelve hasta 2000 headers, cada uno seguido por un conteo de transacciones que debe ser cero en un mensaje headers. El cliente valida enlace y PoW antes de pedir más.

### Lista de implementación
Una capa de red completa parsea envelopes, valida magic y checksum, serializa comandos con padding correcto, ejecuta el handshake version/verack, envía getheaders, parsea respuestas headers y separa constantes de mainnet, testnet y regtest.

