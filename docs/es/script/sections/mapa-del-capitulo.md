<!-- order: 1 -->

## Mapa del capítulo

Script es el mecanismo de autorización de Bitcoin: cada satoshi está protegido por un programa corto que solo se ejecuta al gastarlo.

Al terminar este capítulo podrás:

- Describir la mecánica de la pila y el flujo de ejecución.
- Interpretar opcodes comunes.
- Parsear y combinar campos de script.
- Construir scripts P2PK y P2PKH.
- Entender por qué existen scripts arbitrarios y sus limitaciones.

En el siguiente capítulo pondremos Script en práctica creando y validando transacciones completas.

## Notas de cobertura completa

### Modelo de ejecución
Script es un lenguaje de pila. Primero corre el script de desbloqueo y deja datos en la pila; luego corre el script de bloqueo y debe terminar con un valor verdadero arriba. No hay estado global ni bucles en la validación estándar. Cada opcode manipula la pila, hashea datos, compara valores o verifica firmas.

### Opcodes y ejemplos
El capítulo avanza desde opcodes simples como OP_DUP, OP_HASH160, OP_EQUAL, OP_EQUALVERIFY, OP_ADD y OP_CHECKSIG hasta scripts estándar completos. Los enteros pequeños tienen opcodes propios; empujes de 1 a 75 bytes usan la longitud como opcode; empujes más largos usan OP_PUSHDATA1, OP_PUSHDATA2 u OP_PUSHDATA4.

### Parseo y serialización de scripts
Un objeto Script es una lista de comandos, donde cada comando es un opcode entero o bytes crudos. El parser debe distinguir opcodes de empujes de datos y leer exactamente la cantidad anunciada. La serialización debe usar la forma válida más corta. El campo script dentro de una transacción también lleva prefijo de longitud, así que parsear scripts y parsear transacciones van juntos.

### Scripts estándar
El capítulo cubre pay-to-pubkey, pay-to-pubkey-hash, pay-to-script-hash, pay-to-witness-pubkey-hash y pay-to-witness-script-hash como una progresión. P2PK expone la llave pública de inmediato. P2PKH guarda HASH160(llave pública) y revela la llave solo al gastar. P2SH y los programas witness mueven complejidad fuera del conjunto UTXO.

### Lista de validación
Para evaluar scripts heredados, concatena script_sig y script_pubkey, ejecuta comandos en orden, falla de inmediato si un opcode falla y considera inválida una pila vacía o con valor falso arriba. Los opcodes de firma necesitan el digest de la transacción, por lo que el evaluador debe recibir el valor z calculado externamente.

