<!-- order: 7 -->

## Cierre

La red P2P de Bitcoin envuelve datos estructurados en mensajes con checksum y comandos tipados.

Lo esencial:

- Cada mensaje tiene **magic**, **command**, **tamaño**, **checksum** y **payload**.
- El **handshake** `version` / `verack` establece la sesión entre peers.
- **`getheaders`** / **`headers`** permiten sincronizar la cadena de bloques de forma eficiente.

En **Verificación simplificada de pagos** usarás esos encabezados junto con pruebas Merkle para validar transacciones sin ejecutar un nodo completo.
