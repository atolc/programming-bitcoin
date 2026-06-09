<!-- order: 10 -->

## Cierre

Script es el guardián de cada satoshi: un intérprete de pila que verifica firmas, hashes y condiciones lógicas en microsegundos.

Lo esencial:

- La validación concatena `script_sig` y `script_pubkey`.
- Los **opcodes** manipulan una pila con reglas estrictas y sin bucles.
- **P2PKH** mejoró la privacidad y compactó las salidas respecto a P2PK.
- Los scripts arbitrarios son posibles pero tienen límites de tamaño y costo.

En **Creación y validación de transacciones** firmarás UTXOs reales, calcularás el digest con `SIGHASH` y probarás todo en testnet.

## Complemento de sección

El logro central de este capítulo es conectar campos de transacción con autorización. Las transacciones identifican salidas previas; Script demuestra que el gastador puede consumirlas. Cuando esa separación está clara, P2PKH, P2SH y SegWit son variaciones sobre dónde viven el compromiso y la prueba.

Antes de continuar, asegúrate de que tu implementación de Script pueda parsear empujes de datos, serializar comandos, evaluar operaciones de pila y llamar verificación de firma con un z externo. El siguiente capítulo depende de esas cuatro piezas.

