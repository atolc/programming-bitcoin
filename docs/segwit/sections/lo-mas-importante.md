<!-- order: 2 -->

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
