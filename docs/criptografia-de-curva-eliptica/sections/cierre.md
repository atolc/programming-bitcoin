<!-- order: 9 -->

## Cierre

Has conectado curvas elípticas con campos finitos, multiplicación escalar, secp256k1 y el esquema ECDSA.

Resumen:

- Los puntos viven en $F_p$ y se suman con fórmulas modulares.
- La llave pública es $eG$; firmar usa un nonce $k$ y produce $(r, s)$.
- El hash del mensaje es la entrada criptográfica real.

En **Serialización** veremos cómo se codifican llaves y firmas en los formatos SEC, DER y Base58 que ves en direcciones y transacciones.
