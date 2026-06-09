<!-- order: 2 -->

## Validación de transacciones

Un nodo completo verifica cada transacción antes de aceptarla en la mempool o en un bloque. Los pasos principales:

1. **Sintaxis**: campos bien formados, tamaños dentro de límites.
2. **UTXOs**: cada entrada referencia un UTXO existente y no gastado.
3. **Valores**: $\sum \text{entradas} \geq \sum \text{salidas}$ (comisión no negativa).
4. **Script**: ejecución exitosa de `script_sig || script_pubkey`.
5. **Firma**: `OP_CHECKSIG` valida la firma sobre el digest correcto.

Para P2PKH, el flujo de script es determinista: firma + llave pública en `script_sig`, hash embebido en `script_pubkey`.

```python-sandbox
checks = {
    "sintaxis OK": True,
    "UTXO existe": True,
    "valores cuadran": True,
    "script ejecuta": True,
    "firma válida": True,
}
valid = all(checks.values())
print("Transacción válida:", valid)
for k, v in checks.items():
    print(f"  {k}: {'✓' if v else '✗'}")
```

> [!TIP]
> La validación es **stateless** por transacción: no necesita historial completo más allá del set de UTXOs. Eso hace posible validar millones de transacciones rápidamente.

## Complemento de sección

La validación de transacciones combina revisiones económicas y de autorización. Las económicas aseguran que las salidas referenciadas existan, no estén gastadas y aporten suficiente valor. Las de autorización ejecutan el script de cada entrada contra el script_pubkey previo usando el hash de firma correcto. Ambas son necesarias.

El flujo del libro minimiza deliberadamente la confianza en datos externos. Obtener transacciones previas desde un servicio sirve para ejercicios, pero la validación de producción deriva spentness y datos de salidas previas desde un conjunto UTXO local. Esa es la diferencia entre verificar una transacción y confiar en la verificación de alguien más.

