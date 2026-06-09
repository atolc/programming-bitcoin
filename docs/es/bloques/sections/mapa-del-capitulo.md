<!-- order: 1 -->

## Mapa del capítulo

Los bloques son la unidad en la que se confirman las transacciones. Aquí verás cómo se empaquetan, qué metadatos llevan y por qué minar es costoso.

Al terminar podrás:

- Describir la transacción coinbase y la recompensa del minero.
- Parsear un encabezado de bloque de 80 bytes.
- Explicar la prueba de trabajo y el objetivo de dificultad.

## Notas de cobertura completa

### Transacciones coinbase
Cada bloque empieza con una transacción coinbase que crea el subsidio del bloque más las comisiones. Su entrada no gasta una salida previa; usa hash previo nulo e índice 0xffffffff. El script_sig de coinbase puede contener datos del minero, y BIP34 exige incluir la altura del bloque al inicio.

### Campos del encabezado
El encabezado de 80 bytes contiene versión, hash del bloque anterior, raíz Merkle, timestamp, bits y nonce. El hash previo enlaza la cadena. La raíz Merkle compromete todas las transacciones. Timestamp es tiempo Unix con límites de consenso. Bits codifica el target de PoW. Nonce es uno de los campos que el minero varía al buscar.

### Señalización de versión
El campo versión se ha usado para actualizaciones y señalización. Los bits de versión estilo BIP9 permiten a mineros anunciar preparación para soft forks. El código de parseo debe preservar los 4 bytes y exponer helpers para revisar bits relevantes.

### Proof of Work
Un bloque es válido solo si doble-SHA256(encabezado), interpretado como entero little-endian, está por debajo del target. El formato compacto bits guarda coeficiente y exponente. La dificultad compara el target actual con el target más fácil. El reajuste cambia la dificultad cada 2016 bloques según el tiempo transcurrido, con límites contra saltos extremos.

### Lista de implementación
Un módulo completo de bloques parsea encabezados, los serializa exactamente, calcula block hash, verifica PoW, decodifica bits a target, calcula dificultad, detecta señalización BIP, parsea altura coinbase y verifica la raíz Merkle contra los hashes de transacción.

