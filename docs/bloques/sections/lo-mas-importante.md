<!-- order: 2 -->

## Lo mas importante

- Un bloque agrupa transacciones y referencia el bloque anterior, formando la cadena.
- La transaccion coinbase crea nuevos bitcoins y cobra comisiones; no consume inputs normales.
- El encabezado de bloque contiene version, hash previo, merkle root, timestamp, bits y nonce.
- El hash del encabezado debe estar por debajo de un target para que el bloque sea valido.
- Minar consiste en buscar un nonce y otros campos que produzcan un hash suficientemente pequeno.
- `bits` codifica el target de forma compacta.
- La dificultad expresa que tan dificil es encontrar un hash valido comparado con una referencia.
- Bitcoin ajusta la dificultad aproximadamente cada 2016 bloques para mantener el intervalo promedio cercano a 10 minutos.
- El merkle root compromete todas las transacciones del bloque en un solo hash dentro del encabezado.
