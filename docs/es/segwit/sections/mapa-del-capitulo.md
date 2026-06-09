<!-- order: 1 -->

## Mapa del capítulo

SegWit (Segregated Witness) separa los datos de firma del resto de la transacción, reduce el problema de maleabilidad y aumenta la capacidad efectiva de bloque.

Al terminar podrás:

- Diferenciar p2wpkh, p2sh-p2wpkh, p2wsh y p2sh-p2wsh.
- Explicar el campo witness y el nuevo peso de transacción.
- Describir las mejoras adicionales que trajo el soft fork.

## Notas de cobertura completa

### Motivación y maleabilidad
SegWit separa los datos witness de la serialización heredada de la transacción. Esto corrige la forma común de maleabilidad donde cambios en script_sig alteran el txid. Los nodos antiguos ven una transacción compatible sin witness, mientras los nodos actualizados validan el compromiso witness y los programas witness.

### p2wpkh nativo
Una salida p2wpkh es versión 0 con hash de llave pública de 20 bytes. Al gastar, script_sig está vacío. El witness contiene firma y llave pública SEC. La validación reconstruye el scriptcode clásico P2PKH para firmar, pero los datos de firma quedan fuera del txid.

### p2sh-p2wpkh anidado
Por compatibilidad, un programa witness p2wpkh puede envolverse dentro de P2SH. El script_pubkey es P2SH; script_sig solo revela el redeem script OP_0 <hash-de-20-bytes>; witness lleva firma y llave pública. Esto da direcciones de aspecto legacy mientras usa validación witness.

### p2wsh y p2sh-p2wsh
P2WSH usa SHA256 de 32 bytes de un witness script. El witness aporta argumentos más el witness script completo. P2SH-P2WSH anidado coloca OP_0 <hash-de-32-bytes> dentro de un redeem script. Esto soporta scripts complejos como multisig con menor peso witness.

### Otras mejoras
SegWit introduce block weight, compromiso witness en coinbase, nuevas reglas de digest de BIP143, versionado de scripts para futuras mejoras y un camino más limpio para protocolos de segunda capa. Una implementación completa distingue txid de wtxid, serializa marker y flag, parsea pilas witness y calcula hashes de firma con montos de salidas previas.

