<!-- order: 1 -->

## Mapa del capítulo

Un cliente ligero no descarga toda la cadena. La verificación simplificada de pagos (SPV) usa árboles de Merkle para comprobar que una transacción está en un bloque sin almacenar todos los bloques completos.

Al terminar podrás:

- Construir un árbol de Merkle y calcular su raíz.
- Explicar por qué SPV confía en los mineros para los encabezados.
- Describir el formato de un bloque Merkle.

## Notas de cobertura completa

### Modelo de seguridad SPV
La verificación simplificada de pagos confía en la prueba de trabajo de los headers y usa pruebas Merkle para inclusión. No valida todas las transacciones por sí misma, así que asume que la cadena válida con más trabajo representa consenso minero. SPV puede demostrar que una transacción está incluida en un bloque, pero no que cada regla interna del bloque fue verificada localmente.

### Construcción Merkle
Un padre Merkle es HASH256(izquierda || derecha). Un nivel padre hashea pares de hashes de transacción; si el nivel tiene cantidad impar, se duplica el último hash. Repetir el proceso da la raíz Merkle guardada en el encabezado. Los hashes se manejan en orden interno de bytes al calcular el árbol.

### Raíz Merkle en bloques
La raíz Merkle compromete el orden y contenido de las transacciones. Si cualquier transacción cambia, cambia el camino hacia la raíz y cambia el hash del encabezado. Un verificador completo de bloques recomputa la raíz desde todos los txids y la compara con el header.

### Árboles Merkle parciales
Un mensaje merkleblock contiene header, cantidad total de transacciones, lista de hashes y bits de flags. Los flags indican cuándo descender y cuándo consumir un hash dado. El resultado es un árbol parcial reconstruido cuya raíz debe coincidir con la raíz Merkle del header.

### Lista de implementación
Un módulo SPV completo calcula padres, niveles y raíces Merkle; maneja hojas impares correctamente; parsea merkleblock; recorre flags y hashes determinísticamente; extrae txids coincidentes y rechaza pruebas cuya raíz reconstruida no coincide con el encabezado.

