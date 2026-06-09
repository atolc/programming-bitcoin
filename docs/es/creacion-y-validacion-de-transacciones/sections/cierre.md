<!-- order: 5 -->

## Cierre

Crear y validar transacciones cierra el ciclo entre teoría y práctica en Bitcoin.

Lo esencial:

- La **validación** comprueba UTXOs, valores, scripts y firmas.
- La **creación** requiere serializar el formato de firma con `SIGHASH`.
- El **script_sig** aporta firma + llave pública para desbloquear P2PKH.
- **Testnet** permite practicar el flujo completo sin coste económico.

En **Pay-to-Script Hash** verás cómo ocultar scripts complejos detrás de un hash, habilitando multisig y contratos más elaborados.

## Complemento de sección

Este capítulo cierra el ciclo desde bytes hasta valor gastable. Ahora puedes parsear una transacción, localizar salidas previas, calcular el digest de firma, verificar gastos existentes y crear un gasto nuevo. Esas capacidades son la base de wallets y de contenedores de script más avanzados.

El siguiente salto conceptual es P2SH, donde el script comprometido queda oculto detrás de un hash hasta el momento del gasto. La misma maquinaria de firma y validación aplica, pero cambia el origen del script.

