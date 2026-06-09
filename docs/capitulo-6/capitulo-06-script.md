# Capitulo 6: Script

## Objetivo del capitulo

Aprender como Bitcoin decide si una salida puede gastarse. El capitulo introduce Script, su pila de ejecucion, opcodes, scripts estandar y el flujo clasico de p2pk y p2pkh.

## Lo mas importante

- Script es un lenguaje simple basado en pila, usado para bloquear y desbloquear monedas.
- Una salida contiene condiciones de gasto; un input proporciona datos para satisfacerlas.
- La validacion combina `scriptSig` y `scriptPubKey`, ejecutando instrucciones sobre una pila.
- Los opcodes manipulan datos, duplican elementos, calculan hashes y verifican firmas.
- p2pk paga directamente a una llave publica, pero expone esa llave desde el inicio.
- p2pkh paga a un hash de llave publica, lo que mejora privacidad y reduce exposicion temprana.
- En p2pkh, el gasto debe proporcionar firma y llave publica; el script verifica que la llave corresponde al hash y que la firma es valida.
- Script no es Turing completo: esta limitado para reducir riesgos de ejecucion infinita y complejidad.
- La expresividad de Script permite mas que pagos simples, aunque la red favorece patrones estandar.

## Que hay que aprender

- Como funciona una pila: push, pop y evaluacion secuencial.
- Que hacen opcodes como `OP_DUP`, `OP_HASH160`, `OP_EQUALVERIFY` y `OP_CHECKSIG`.
- Como parsear un script desde bytes.
- Como serializar scripts con prefijos de longitud.
- Como evaluar p2pk y p2pkh.
- Por que el script de bloqueo y el de desbloqueo forman una sola condicion de validacion.

## Ideas para estudiar

- Ejecutar manualmente un script p2pkh paso a paso sobre una pila.
- Implementar parser y serializer para Script.
- Implementar un conjunto minimo de opcodes.
- Probar firmas validas e invalidas dentro de `OP_CHECKSIG`.

## Resultado esperado

Al terminar, deberias poder explicar por que "tener bitcoin" significa poder satisfacer condiciones de Script asociadas a UTXOs.
