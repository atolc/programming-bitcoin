<!-- order: 8 -->

## Cierre

SegWit separó las firmas del cuerpo de la transacción y abrió la puerta a formatos más eficientes.

Lo esencial:

- **p2wpkh** y **p2wsh** usan witness programs nativos (direcciones `bc1...`).
- **p2sh-p2wpkh** y **p2sh-p2wsh** anidan SegWit para compatibilidad con direcciones `3...`.
- El **weight** y BIP143 cambian cómo se miden bloques y cómo se firman transacciones.

En **Temas avanzados y siguientes pasos** encontrarás rutas de estudio posteriores: Taproot, Lightning, contribución al ecosistema y proyectos para seguir practicando.

## Complemento de sección

SegWit reorganiza dónde viven los datos de firma y cómo se comprometen. El resultado es menor maleabilidad, mejor contabilidad de comisiones, hashing de firma mejorado y una ruta para futuras mejoras de script. La separación conceptual entre txid y wtxid debe estar clara antes de implementar lógica de wallet.

Al terminar este capítulo, debes poder identificar plantillas witness nativas y anidadas, serializar transacciones witness y explicar por qué los montos de salidas previas forman parte de los hashes de firma SegWit.

