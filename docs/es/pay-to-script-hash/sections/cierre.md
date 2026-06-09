<!-- order: 6 -->

## Cierre

P2SH hizo práctico el multisig y los contratos complejos sin sobrecargar a quien paga.

Lo esencial:

- **Bare multisig** expone toda la lógica en el `script_pubkey`; es poco práctico.
- **OP_CHECKMULTISIG** requiere el byte dummy `OP_0` por compatibilidad histórica.
- **P2SH** bloquea fondos al hash del redeem script; la lógica se revela al gastar.
- Las direcciones `3...` son P2SH en mainnet; el prefijo de versión es `0x05`.

En **Bloques** verás cómo las transacciones validadas se empaquetan, minan y encadenan en la blockchain.
