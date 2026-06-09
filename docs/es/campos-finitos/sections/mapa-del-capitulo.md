<!-- order: 1 -->

## Mapa del Capítulo

Este capítulo construye una pieza matemática fundamental que Bitcoin necesita antes de hablar de llaves, firmas y curvas elípticas: los **campos finitos**.

La idea central es sencilla: en lugar de trabajar con todos los números reales posibles (que son infinitos y sufren de imprecisiones de coma flotante), trabajamos con un conjunto limitado de elementos y definimos operaciones matemáticas especiales que garantizan que el resultado siempre permanezca dentro de ese mismo conjunto.

Al terminar este capítulo, serás capaz de:
*   Explicar qué es un campo finito $F_p$.
*   Utilizar la aritmética modular para mantener los resultados entre $0$ y $p-1$.
*   Sumar, restar, multiplicar, elevar a potencias y dividir dentro de un campo finito.
*   Entender y demostrar por qué el orden del campo debe ser un número primo en criptografía.
*   Implementar la clase completa `FieldElement` en Python.
*   Ver cómo esta estructura es la base para la criptografía de curva elíptica.

---
