# Capitulo 5: Transacciones

## Objetivo del capitulo

Entender la estructura de una transaccion Bitcoin: version, inputs, outputs, scripts, locktime y comisiones. El capitulo se enfoca en parsear y representar transacciones reales.

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

## Que hay que aprender

- Parsear version, inputs, outputs y locktime desde bytes.
- Representar `Tx`, `TxIn` y `TxOut`.
- Entender outpoints: combinacion de hash de transaccion previa e indice de salida.
- Diferenciar cantidad enviada, cambio y comision.
- Recuperar informacion de transacciones previas para conocer el valor de los inputs.
- Serializar una transaccion despues de parsearla.

## Ideas para estudiar

- Parsear una transaccion real y listar sus inputs y outputs.
- Calcular su comision usando los valores de las salidas previas.
- Identificar cual output podria ser pago y cual podria ser cambio.
- Practicar conversion de `txid` entre orden mostrado y orden serializado.

## Resultado esperado

Al terminar, deberias poder leer una transaccion cruda, separar sus partes principales y explicar como mueve valor en el modelo UTXO.
