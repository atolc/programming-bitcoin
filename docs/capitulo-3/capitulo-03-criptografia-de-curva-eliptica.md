# Capitulo 3: Criptografia de curva eliptica

## Objetivo del capitulo

Unir campos finitos y curvas elipticas para construir la criptografia que usa Bitcoin. El capitulo introduce `secp256k1`, multiplicacion escalar, llaves privadas/publicas, firmas y verificacion.

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

## Que hay que aprender

- Como se combinan campos finitos y curvas elipticas.
- Que son `P`, `N`, `G`, llave privada, llave publica, firma `r,s` y mensaje `z`.
- Como implementar multiplicacion escalar de forma eficiente con doble-y-suma.
- Como funciona la firma ECDSA a nivel conceptual.
- Como verificar firmas ECDSA sin conocer la llave privada.
- Por que el nonce de firma debe ser unico y secreto.

## Ideas para estudiar

- Implementar clases especializadas para `S256Field`, `S256Point` y `Signature`.
- Probar que `N * G` produce el punto al infinito.
- Firmar y verificar mensajes de prueba.
- Estudiar la diferencia entre "autenticidad" y "secreto": las firmas no cifran, autorizan.

## Resultado esperado

Al terminar, deberias poder explicar como una llave privada genera una llave publica, por que esa relacion es segura en una sola direccion y como una firma demuestra autorizacion en una transaccion Bitcoin.
