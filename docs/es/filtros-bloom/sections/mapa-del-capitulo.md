<!-- order: 1 -->

## Mapa del capítulo

Los filtros Bloom permiten que un cliente ligero pida solo las transacciones que le interesan, sin revelar todas sus direcciones al nodo completo.

Al terminar podrás:

- Explicar falsos positivos y por qué no hay falsos negativos (si está bien configurado).
- Cargar un filtro según BIP37.
- Relacionar filtros Bloom con bloques Merkle.

## Notas de cobertura completa

### Concepto de filtro Bloom
Un filtro Bloom es un conjunto probabilístico. Agregar un elemento activa varias posiciones de bits derivadas de funciones hash independientes. Consultar revisa esas mismas posiciones. Si algún bit es cero, el elemento definitivamente no está; si todos son uno, quizá esté. Los falsos positivos son esperados; no debe haber falsos negativos si se usan los mismos parámetros.

### Funciones hash y tamaño
El capítulo deriva varias funciones hash desde Murmur3 usando tweak e índice de función. Tamaño del filtro y cantidad de funciones intercambian ancho de banda contra privacidad. Un filtro muy pequeño produce demasiados falsos positivos; uno demasiado preciso revela demasiado interés.

### Mensajes BIP37
BIP37 define filterload, filteradd y filterclear. Filterload envía bit field, número de funciones hash, tweak y flags de actualización. Los nodos que soportan filtros Bloom pueden enviar bloques Merkle y transacciones relevantes. Bitcoin Core moderno limita o desactiva este servicio por privacidad y DoS, pero sigue siendo importante histórica y educativamente.

### Bloques Merkle y transacciones
Con un filtro cargado, la wallet pide bloques filtrados usando getdata con MSG_FILTERED_BLOCK u objetos relacionados. El peer devuelve un merkleblock más mensajes tx coincidentes. La wallet verifica la prueba Merkle contra headers conocidos y luego inspecciona localmente las transacciones.

### Lista de implementación
Un módulo completo de Bloom calcula posiciones con Murmur3, serializa el bit field little-endian por byte, construye payloads filterload, soporta conceptualmente filteradd/filterclear, solicita bloques Merkle y considera la fuga de privacidad por consultas repetidas.

