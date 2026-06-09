<!-- order: 2 -->

## Lo mas importante

- Multisig permite exigir varias firmas para gastar una salida, por ejemplo 2-de-3.
- El multisig "bare" pone el script completo en la salida, lo que crea problemas de tamano, privacidad y responsabilidad para quien paga.
- p2sh mueve la complejidad al momento del gasto: la salida solo contiene el hash del redeem script.
- Quien gasta debe revelar el redeem script y proporcionar datos que lo satisfagan.
- La red verifica primero que el redeem script coincida con el hash y luego ejecuta ese script.
- p2sh simplifica direcciones para quien paga: se paga a una direccion que representa un script.
- El patron p2sh habilito pagos a condiciones mas complejas sin cambiar la experiencia basica de envio.
- `OP_CHECKMULTISIG` tiene una peculiaridad historica: requiere un elemento extra en la pila.
