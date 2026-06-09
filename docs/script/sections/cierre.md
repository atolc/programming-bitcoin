<!-- order: 10 -->

## Cierre

Script es el guardián de cada satoshi: un intérprete de pila que verifica firmas, hashes y condiciones lógicas en microsegundos.

Lo esencial:

- La validación concatena `script_sig` y `script_pubkey`.
- Los **opcodes** manipulan una pila con reglas estrictas y sin bucles.
- **P2PKH** mejoró la privacidad y compactó las salidas respecto a P2PK.
- Los scripts arbitrarios son posibles pero tienen límites de tamaño y costo.

En **Creación y validación de transacciones** firmarás UTXOs reales, calcularás el digest con `SIGHASH` y probarás todo en testnet.
