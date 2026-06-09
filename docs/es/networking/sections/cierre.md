<!-- order: 7 -->

## Cierre

La red P2P de Bitcoin envuelve datos estructurados en mensajes con checksum y comandos tipados.

Lo esencial:

- Cada mensaje tiene **magic**, **command**, **tamaño**, **checksum** y **payload**.
- El **handshake** `version` / `verack` establece la sesión entre peers.
- **`getheaders`** / **`headers`** permiten sincronizar la cadena de bloques de forma eficiente.

En **Verificación simplificada de pagos** usarás esos encabezados junto con pruebas Merkle para validar transacciones sin ejecutar un nodo completo.

## Complemento de sección

Este capítulo convierte el código local de serialización en comunicación con peers. La misma disciplina de orden de bytes usada en transacciones y bloques aplica ahora a envelopes y payloads. Los errores de red suelen parecer errores de parseo, así que separa parseo de envelope, parseo de payload y estados del peer.

Los capítulos siguientes usan esta maquinaria para verificación ligera: pedir headers, pedir bloques filtrados y verificar pruebas localmente. Un cliente que no delimita mensajes de forma confiable no puede hacer SPV con seguridad.

