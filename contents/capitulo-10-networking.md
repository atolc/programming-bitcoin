# Capitulo 10: Networking

## Objetivo del capitulo

Aprender como los nodos Bitcoin se comunican. El capitulo introduce mensajes de red, envelopes, handshake, version/verack y descarga de encabezados.

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

## Que hay que aprender

- Estructura de un network envelope.
- Como parsear y serializar mensajes de red.
- Que datos incluye un mensaje `version`.
- Como completar un handshake con un nodo.
- Como pedir encabezados de bloque.
- Como interpretar una respuesta `headers`.
- Por que conviene verificar encabezados antes de confiar en datos mas pesados.

## Ideas para estudiar

- Implementar `NetworkEnvelope`.
- Conectarse a un nodo testnet y completar `version`/`verack`.
- Pedir encabezados desde un bloque conocido.
- Validar que los encabezados formen una cadena por `previous block`.

## Resultado esperado

Al terminar, deberias poder escribir codigo que hable el protocolo basico de Bitcoin y obtenga encabezados desde la red.
