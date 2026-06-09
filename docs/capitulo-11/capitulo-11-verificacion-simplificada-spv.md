# Capitulo 11: Verificacion simplificada de pagos

## Objetivo del capitulo

Entender SPV y arboles de Merkle. El capitulo muestra como verificar que una transaccion pertenece a un bloque sin descargar todas las transacciones del bloque.

## Lo mas importante

- SPV permite a clientes ligeros verificar inclusion de transacciones usando encabezados y pruebas de Merkle.
- Un arbol de Merkle combina hashes de transacciones hasta producir una sola raiz: el merkle root.
- El merkle root esta en el encabezado del bloque, por lo que queda protegido por la prueba de trabajo.
- Para probar inclusion no hace falta todo el bloque, solo los hashes necesarios para reconstruir la raiz.
- Si un nivel tiene cantidad impar de hashes, Bitcoin duplica el ultimo hash para calcular el nivel siguiente.
- Un merkle block contiene hashes parciales y bits de bandera para reconstruir solo las ramas relevantes.
- La seguridad SPV depende de seguir la cadena con mas proof-of-work y de recibir pruebas correctas.
- SPV verifica inclusion, pero no valida todos los scripts ni todas las reglas de consenso como un nodo completo.

## Que hay que aprender

- Calcular merkle parent con doble SHA256 de dos hashes concatenados.
- Construir niveles de un arbol de Merkle.
- Calcular merkle root desde una lista de tx hashes.
- Verificar que el merkle root coincide con el encabezado del bloque.
- Parsear y validar un `merkleblock`.
- Entender la diferencia entre inclusion en bloque y validez completa.

## Ideas para estudiar

- Crear una funcion que calcule merkle root para una lista de hashes.
- Probar listas con numero par e impar de hashes.
- Reconstruir una prueba parcial de Merkle.
- Comparar SPV con operar un nodo completo.

## Resultado esperado

Al terminar, deberias poder explicar como una wallet ligera confirma que una transaccion fue incluida en un bloque sin descargar el bloque entero.
