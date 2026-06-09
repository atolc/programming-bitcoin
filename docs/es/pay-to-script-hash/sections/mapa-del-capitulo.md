<!-- order: 1 -->

## Mapa del capítulo

P2SH fue el puente entre scripts simples (P2PKH) y el ecosistema de wallets y multisig que conocemos hoy.

Al terminar este capítulo podrás:

- Construir transacciones multisig sin envolver (*bare multisig*).
- Usar `OP_CHECKMULTISIG` y entender el off-by-one histórico.
- Crear direcciones y scripts P2SH.
- Codificar el gasto de un UTXO P2SH paso a paso.

En el siguiente capítulo estudiaremos **Bloques** y cómo las transacciones se agrupan y confirman en la cadena.

## Notas de cobertura completa

### Multisig sin envolver
Bare multisig coloca todo el script multifirma directamente en el script_pubkey. Un script m-de-n típico empuja m, las llaves públicas, n y OP_CHECKMULTISIG. Funciona, pero hace las salidas grandes, expone todas las condiciones antes del gasto y obliga al pagador a entender el script completo del receptor.

### Peculiaridad de CHECKMULTISIG
OP_CHECKMULTISIG tiene un comportamiento histórico off-by-one: consume un elemento adicional de la pila. Por eso un gasto multisig empieza con un cero dummy. Las implementaciones deben preservar este comportamiento por compatibilidad de consenso aunque el elemento no se use.

### Diseño P2SH
P2SH cambia la interfaz para recibir. El pagador paga a HASH160(redeem_script), codificado como dirección Base58Check con byte de versión P2SH. El gastador revela después el redeem script completo en script_sig. El nodo verifica primero que HASH160(redeem_script) coincida con el hash del script_pubkey y luego evalúa el redeem script con los elementos restantes.

### Disciplina del redeem script
El redeem script no se puede recuperar de la cadena hasta que se gasta. La wallet debe guardarlo. Perderlo puede dejar monedas imposibles de gastar aunque las llaves privadas existan. El digest para firmar un gasto P2SH usa el redeem script como script de la entrada que se firma.

### Lista de implementación
Una implementación completa construye redeem scripts, los hashea con HASH160, codifica direcciones P2SH, construye script_pubkey como OP_HASH160 <hash-de-20-bytes> OP_EQUAL, arma script_sig con firmas más redeem script y evalúa la regla P2SH en dos etapas.

