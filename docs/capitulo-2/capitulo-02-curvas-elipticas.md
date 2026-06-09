# Capitulo 2: Curvas elipticas

## Objetivo del capitulo

Presentar las curvas elipticas como objetos matematicos y definir como sumar puntos sobre ellas. Este capitulo prepara el terreno para la criptografia de curva eliptica que Bitcoin usa para llaves, firmas y verificacion.

## Lo mas importante

- Una curva eliptica tiene forma general `y^2 = x^3 + ax + b`.
- No cualquier punto pertenece a una curva: sus coordenadas deben satisfacer la ecuacion.
- Existe un punto especial llamado punto al infinito, que funciona como identidad aditiva.
- La suma de puntos no es suma componente a componente. Se define geometricamente: una linea que cruza la curva permite encontrar un tercer punto, y luego se refleja.
- Hay varios casos para sumar puntos: puntos distintos, punto al infinito, puntos inversos y duplicacion de un punto.
- Cuando dos puntos tienen la misma `x` pero distinta `y`, su suma da el punto al infinito.
- La duplicacion de un punto usa la pendiente de la tangente a la curva.
- Codificar la suma de puntos exige manejar excepciones y casos especiales con claridad.

## Que hay que aprender

- Como validar si un punto esta en una curva.
- Que representa el punto al infinito y por que es necesario.
- Como se calcula la pendiente para sumar dos puntos distintos.
- Como se calcula la pendiente para duplicar un punto.
- Por que la suma de puntos crea una estructura algebraica util.
- Como modelar puntos y curvas en Python sin mezclar curvas incompatibles.

## Ideas para estudiar

- Dibujar una curva simple y simular la suma de puntos geometricamente.
- Implementar una clase `Point` con validacion de pertenencia a la curva.
- Escribir pruebas para sumar con el punto al infinito, sumar inversos y duplicar puntos.
- Comparar la intuicion geometrica con las formulas algebraicas.

## Resultado esperado

Al terminar, deberias entender que las curvas elipticas tienen una operacion de suma bien definida y que esa operacion, aunque rara al principio, es la base para construir criptografia de clave publica.
