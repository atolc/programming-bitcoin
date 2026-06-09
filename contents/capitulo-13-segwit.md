# Capitulo 13: Segwit

## Objetivo del capitulo

Entender Segregated Witness y los cambios que introduce en transacciones, firmas y scripts. El capitulo cubre p2wpkh, p2wsh, variantes envueltas en p2sh y mejoras asociadas.

## Lo mas importante

- Segwit separa los datos de testigo de la parte tradicional de la transaccion.
- La separacion ayuda a resolver la maleabilidad de transacciones, donde una firma podia cambiar el `txid` sin cambiar el efecto economico.
- p2wpkh es el equivalente Segwit de p2pkh: paga a un hash de llave publica, pero la firma y llave van en witness.
- p2wsh es el equivalente Segwit para scripts complejos, similar en espiritu a p2sh.
- p2sh-p2wpkh y p2sh-p2wsh permiten compatibilidad con wallets antiguas usando direcciones p2sh.
- Las transacciones Segwit tienen serializacion extendida con marker, flag y witness data.
- El `txid` excluye witness; el `wtxid` incluye witness.
- La firma Segwit usa un algoritmo de hashing distinto definido por BIP143, que incluye montos de inputs y mejora seguridad/eficiencia.
- Segwit habilita mejoras importantes como Lightning Network al estabilizar identificadores de transacciones no confirmadas.

## Que hay que aprender

- Diferenciar datos base de transaccion y datos witness.
- Parsear y serializar transacciones Segwit.
- Construir y validar p2wpkh.
- Construir y validar p2wsh.
- Entender formatos envueltos en p2sh para compatibilidad.
- Calcular hashes de firma estilo BIP143.
- Distinguir `txid` y `wtxid`.

## Ideas para estudiar

- Comparar una transaccion p2pkh tradicional con una p2wpkh.
- Implementar verificacion de firma p2wpkh.
- Construir una transaccion p2sh-p2wpkh de testnet.
- Revisar como witness cambia el peso de una transaccion y no solo su tamano bruto.

## Resultado esperado

Al terminar, deberias poder explicar por que Segwit fue un cambio estructural clave para Bitcoin y como cambia la forma de firmar, identificar y validar transacciones.
