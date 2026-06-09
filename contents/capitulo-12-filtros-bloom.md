# Capitulo 12: Filtros Bloom

## Objetivo del capitulo

Aprender como los filtros Bloom ayudan a clientes ligeros a pedir transacciones relevantes sin revelar exactamente todas sus direcciones. El capitulo cubre BIP37, funciones hash y busqueda de merkle blocks.

## Lo mas importante

- Un filtro Bloom es una estructura probabilistica para probar pertenencia a un conjunto.
- Puede tener falsos positivos, pero no falsos negativos si fue construido correctamente.
- Los falsos positivos mejoran privacidad parcialmente porque ocultan cuales coincidencias eran realmente buscadas.
- El filtro se representa como bits; varias funciones hash activan posiciones dentro del arreglo.
- BIP37 define como cargar filtros Bloom en nodos Bitcoin usando mensajes de red.
- Despues de cargar un filtro, un cliente puede pedir bloques filtrados y recibir merkle blocks.
- El parametro de tamano, numero de funciones y tweak afecta privacidad, ancho de banda y tasa de falsos positivos.
- BIP37 es importante historicamente, aunque tiene limitaciones de privacidad frente a adversarios activos.

## Que hay que aprender

- Como funciona una estructura de pertenencia probabilistica.
- Que significa falso positivo y por que no debe haber falsos negativos.
- Como usar varias funciones hash para marcar posiciones.
- Como serializar un filtro Bloom segun BIP37.
- Como enviar `filterload` y pedir datos filtrados.
- Como combinar filtros Bloom con merkle blocks para SPV.

## Ideas para estudiar

- Construir un filtro pequeno y agregar elementos manualmente.
- Medir como cambia la tasa de falsos positivos al variar tamano y numero de funciones.
- Crear un filtro para una direccion testnet y pedir transacciones relacionadas.
- Reflexionar sobre que informacion todavia puede filtrar una wallet ligera.

## Resultado esperado

Al terminar, deberias entender como un cliente SPV reduce ancho de banda buscando transacciones relevantes y cuales son los compromisos de privacidad de ese metodo.
