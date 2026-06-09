# Capitulo 8: Pay-to-Script Hash

## Objetivo del capitulo

Entender p2sh, una forma de pagar a un hash de script en vez de poner todo el script de bloqueo directamente en la salida. El capitulo usa multisig como motivacion principal.

## Lo mas importante

- Multisig permite exigir varias firmas para gastar una salida, por ejemplo 2-de-3.
- El multisig "bare" pone el script completo en la salida, lo que crea problemas de tamano, privacidad y responsabilidad para quien paga.
- p2sh mueve la complejidad al momento del gasto: la salida solo contiene el hash del redeem script.
- Quien gasta debe revelar el redeem script y proporcionar datos que lo satisfagan.
- La red verifica primero que el redeem script coincida con el hash y luego ejecuta ese script.
- p2sh simplifica direcciones para quien paga: se paga a una direccion que representa un script.
- El patron p2sh habilito pagos a condiciones mas complejas sin cambiar la experiencia basica de envio.
- `OP_CHECKMULTISIG` tiene una peculiaridad historica: requiere un elemento extra en la pila.

## Que hay que aprender

- Como construir un script multisig.
- Como funciona `OP_CHECKMULTISIG`.
- Que es un redeem script.
- Como calcular el hash de un script y crear una direccion p2sh.
- Como se evalua una transaccion p2sh durante el gasto.
- Diferenciar entre script visible al pagar y script revelado al gastar.

## Ideas para estudiar

- Crear un redeem script 2-de-3 y derivar su direccion p2sh.
- Simular el gasto con dos firmas validas.
- Ver que el orden de firmas debe corresponder a las llaves publicas esperadas.
- Comparar el tamano y privacidad de bare multisig frente a p2sh.

## Resultado esperado

Al terminar, deberias poder explicar por que p2sh hizo mas practicos los scripts complejos y como Bitcoin valida que un redeem script corresponde a una salida p2sh.
