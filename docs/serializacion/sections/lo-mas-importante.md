<!-- order: 2 -->

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
