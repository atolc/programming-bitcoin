<!-- order: 2 -->

## Lo mas importante

- Bitcoin usa el modelo UTXO: las transacciones consumen salidas anteriores y crean nuevas salidas.
- Un input apunta a una salida previa mediante `txid` e indice.
- Un output define una cantidad en satoshis y un script de bloqueo.
- Las transacciones no tienen un campo explicito de "saldo"; el valor disponible se deriva de UTXOs.
- La comision se calcula como suma de inputs menos suma de outputs.
- Para validar una comision, hay que conocer las transacciones previas referenciadas por los inputs.
- `scriptSig` y `scriptPubKey` se evaluan juntos para decidir si un input puede gastar una salida.
- `locktime` puede restringir cuando una transaccion es valida.
- Los `txid` suelen mostrarse en orden humano invertido respecto a como aparecen serializados internamente.
