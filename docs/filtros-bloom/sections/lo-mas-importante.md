<!-- order: 2 -->

## Lo mas importante

- Un filtro Bloom es una estructura probabilistica para probar pertenencia a un conjunto.
- Puede tener falsos positivos, pero no falsos negativos si fue construido correctamente.
- Los falsos positivos mejoran privacidad parcialmente porque ocultan cuales coincidencias eran realmente buscadas.
- El filtro se representa como bits; varias funciones hash activan posiciones dentro del arreglo.
- BIP37 define como cargar filtros Bloom en nodos Bitcoin usando mensajes de red.
- Despues de cargar un filtro, un cliente puede pedir bloques filtrados y recibir merkle blocks.
- El parametro de tamano, numero de funciones y tweak afecta privacidad, ancho de banda y tasa de falsos positivos.
- BIP37 es importante historicamente, aunque tiene limitaciones de privacidad frente a adversarios activos.
