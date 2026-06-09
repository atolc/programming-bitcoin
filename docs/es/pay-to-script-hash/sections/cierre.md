<!-- order: 6 -->

## Cierre

P2SH hizo práctico el multisig y los contratos complejos sin sobrecargar a quien paga.

Lo esencial:

- **Bare multisig** expone toda la lógica en el `script_pubkey`; es poco práctico.
- **OP_CHECKMULTISIG** requiere el byte dummy `OP_0` por compatibilidad histórica.
- **P2SH** bloquea fondos al hash del redeem script; la lógica se revela al gastar.
- Las direcciones `3...` son P2SH en mainnet; el prefijo de versión es `0x05`.

En **Bloques** verás cómo las transacciones validadas se empaquetan, minan y encadenan en la blockchain.

## Complemento de sección

P2SH es una técnica de empaquetado, no un algoritmo de firma nuevo. Cambia cuándo se revela el script complejo y quién necesita entenderlo. El pagador maneja solo una dirección basada en hash; el gastador revela y satisface el script después.

Este capítulo prepara para SegWit porque los programas witness anidados reutilizan la misma idea: poner un compromiso compacto en un lugar y revelar datos detallados de gasto en otro. Las reglas exactas difieren, pero la presión de diseño es parecida.

