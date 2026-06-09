<!-- order: 2 -->

## Lo mas importante

- SPV permite a clientes ligeros verificar inclusion de transacciones usando encabezados y pruebas de Merkle.
- Un arbol de Merkle combina hashes de transacciones hasta producir una sola raiz: el merkle root.
- El merkle root esta en el encabezado del bloque, por lo que queda protegido por la prueba de trabajo.
- Para probar inclusion no hace falta todo el bloque, solo los hashes necesarios para reconstruir la raiz.
- Si un nivel tiene cantidad impar de hashes, Bitcoin duplica el ultimo hash para calcular el nivel siguiente.
- Un merkle block contiene hashes parciales y bits de bandera para reconstruir solo las ramas relevantes.
- La seguridad SPV depende de seguir la cadena con mas proof-of-work y de recibir pruebas correctas.
- SPV verifica inclusion, pero no valida todos los scripts ni todas las reglas de consenso como un nodo completo.
