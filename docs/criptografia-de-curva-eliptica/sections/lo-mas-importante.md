<!-- order: 2 -->

## Lo mas importante

- Bitcoin no usa curvas sobre numeros reales, sino curvas elipticas sobre campos finitos.
- La curva de Bitcoin es `secp256k1`, definida por `y^2 = x^3 + 7` sobre un campo primo enorme.
- La multiplicacion escalar consiste en sumar un punto consigo mismo muchas veces.
- Una llave privada es un numero secreto; la llave publica es ese numero multiplicado por el punto generador `G`.
- Es facil calcular la llave publica desde la privada, pero impractico recuperar la privada desde la publica. Esa asimetria es el problema del logaritmo discreto.
- El orden del grupo define cuantas veces se puede sumar `G` antes de volver al punto al infinito.
- Firmar prueba conocimiento de la llave privada sin revelarla.
- Verificar una firma usa la llave publica, el mensaje y la firma para confirmar que el propietario de la llave privada autorizo el mensaje.
- La seguridad practica depende de elegir bien valores aleatorios como `k`; reutilizar o filtrar `k` puede revelar la llave privada.

> [!IMPORTANT]
> La llave privada es un entero aleatorio en el rango `[1, N-1]`. Nunca debe reutilizarse el nonce `k` en firmas ECDSA: dos firmas con el mismo `k` pueden filtrar la llave privada.
