<!-- order: 1 -->

## Mapa del capítulo

Las transacciones son el corazón operativo de Bitcoin: todo lo demás (bloques, mempool, wallets) gira en torno a crearlas, validarlas y confirmarlas.

Al terminar este capítulo podrás:

- Identificar los componentes de una transacción (versión, entradas, salidas, locktime).
- Leer y escribir campos en formato binario.
- Calcular comisiones implícitas.
- Serializar y deserializar transacciones en Python.

En el siguiente capítulo veremos **Script**, el mini-lenguaje que define las condiciones de gasto de cada salida.

## Notas de cobertura completa

### Estructura de una transacción
Una transacción gasta salidas anteriores y crea salidas nuevas. El capítulo no trata solo los cuatro campos visibles; también explica el modelo UTXO que hay detrás. Una entrada apunta a un hash de transacción previa y a un índice de salida, y después aporta datos de desbloqueo. Una salida declara una cantidad en satoshis y un script de bloqueo. Los nodos validan que cada entrada refiera una salida existente y no gastada, que el desbloqueo satisfaga el bloqueo y que la transacción no cree valor de la nada.

### Detalles de codificación binaria
El capítulo introduce enteros compactos, normalmente llamados varints, porque las listas de entradas y salidas tienen longitud variable. Los valores menores que 0xfd usan un byte; valores mayores usan los marcadores 0xfd, 0xfe o 0xff seguidos por enteros little-endian. Los hashes se muestran a humanos en big-endian, pero se serializan internamente en little-endian, así que el código debe invertirlos solo en el borde correcto.

### Entradas, salidas y scripts
Cada entrada contiene id de transacción previa, índice de salida previa, longitud del script_sig, script_sig y sequence. Cada salida contiene cantidad, longitud del script_pubkey y script_pubkey. La transacción no guarda direcciones; las direcciones son codificaciones de wallet derivadas de scripts o hashes de scripts.

### Sequence, locktime y comisiones
Sequence normalmente vale 0xffffffff. Valores no finales pueden activar reemplazo y bloqueos relativos. Locktime se ignora si todas las entradas tienen sequence final. La comisión es implícita: suma de entradas menos suma de salidas. Como los montos de entrada viven en transacciones previas, calcular la comisión exige consultar los UTXO referenciados.

### Lista de implementación
Una implementación completa parsea y serializa varints, entradas, salidas, locktime y transacciones completas; conserva el orden de bytes; calcula el txid como doble SHA256 de la serialización, invertido para mostrarlo; y calcula comisiones solo después de obtener las salidas previas.

