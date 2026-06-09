# Capitulo 4: Serializacion

## Objetivo del capitulo

Aprender a convertir objetos criptograficos internos en bytes intercambiables por la red y por wallets. El capitulo cubre formatos SEC, DER, Base58, direcciones, WIF y endianess.

## Lo mas importante

- La serializacion transforma datos como puntos, firmas y enteros en bytes con formato estable.
- Las llaves publicas pueden serializarse en formato SEC sin comprimir o comprimido.
- El formato SEC comprimido guarda solo `x` y la paridad de `y`, porque `y` puede recuperarse matematicamente.
- Las firmas ECDSA se codifican comunmente en DER para representar `r` y `s`.
- Base58 evita caracteres ambiguos y se usa para direcciones y llaves privadas en formato WIF.
- Las direcciones Bitcoin incluyen version de red, hash de llave publica o script, y checksum.
- El checksum ayuda a detectar errores de tipeo o copia.
- Bitcoin usa big-endian y little-endian en distintos lugares; entender esto evita errores sutiles al parsear bytes.
- WIF es una forma amigable de exportar/importar llaves privadas, con indicador de red y de compresion.

## Que hay que aprender

- Diferenciar formato interno de objeto y formato serializado en bytes.
- Codificar y parsear llaves publicas SEC comprimidas y sin comprimir.
- Codificar y parsear firmas DER.
- Calcular `hash160`: SHA256 seguido de RIPEMD160.
- Crear direcciones Base58Check para mainnet y testnet.
- Convertir enteros entre big-endian y little-endian.
- Entender que una direccion no es una llave publica completa, sino una representacion con hash y metadatos.

## Ideas para estudiar

- Generar una llave publica y serializarla en ambos formatos SEC.
- Crear una direccion testnet desde una llave publica.
- Convertir una llave privada a WIF y verificar que la version cambia entre mainnet y testnet.
- Practicar parseo de enteros desde bytes en ambos endianess.

## Resultado esperado

Al terminar, deberias poder tomar llaves y firmas generadas por tu codigo y convertirlas a formatos que Bitcoin y las wallets entienden.
