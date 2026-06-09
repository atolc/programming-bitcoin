# Capitulo 9: Bloques

## Objetivo del capitulo

Entender la estructura de los bloques y la prueba de trabajo. El capitulo cubre coinbase, encabezados de bloque, bits, target, dificultad y ajuste de dificultad.

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

## Que hay que aprender

- Parsear encabezados de bloque.
- Calcular el hash de un bloque usando doble SHA256 del encabezado.
- Convertir `bits` a target.
- Verificar prueba de trabajo.
- Calcular dificultad aproximada.
- Entender la funcion de la coinbase y de BIP34.
- Razonar sobre por que alterar una transaccion cambia el merkle root y rompe el bloque.

## Ideas para estudiar

- Parsear un bloque real y verificar su proof-of-work.
- Calcular target desde `bits` y compararlo con el hash del encabezado.
- Observar como cambia el hash al modificar un solo byte.
- Implementar funciones `bits_to_target`, `target_to_bits` y ajuste de dificultad.

## Resultado esperado

Al terminar, deberias poder validar el encabezado de un bloque y explicar como la prueba de trabajo protege la historia de transacciones.
