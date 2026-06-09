<!-- order: 2 -->

## Motivación

Un **nodo completo** almacena todo el blockchain, valida cada script y mantiene el conjunto UTXO. Eso ofrece máxima seguridad, pero exige mucho disco, RAM y ancho de banda.

La **verificación simplificada de pagos** (SPV, *Simplified Payment Verification*) permite a una wallet:

1. Descargar solo **encabezados de bloque** (80 bytes cada uno).
2. Verificar la **prueba de trabajo** acumulada de la cadena.
3. Obtener una **prueba Merkle** de que una transacción está en un bloque concreto.

```python-sandbox
FULL_NODE_GB = 600
SPV_HEADERS_MB = 60  # ~800k bloques x 80 bytes
print(f"Nodo completo: ~{FULL_NODE_GB} GB")
print(f"Solo encabezados: ~{SPV_HEADERS_MB} MB")
```

SPV asume que la cadena con más trabajo acumulado es la correcta. No detecta por sí solo transacciones inválidas que nunca llegaron a un bloque minado, pero sí puede comprobar que un pago fue **incluido** en un bloque confirmado.

> [!TIP]
> SPV confía en que los mineros no coluden para ocultarte transacciones incluidas en bloques que sí te muestran. Para montos grandes, muchas wallets consultan varios nodos o usan tu propio nodo completo.
