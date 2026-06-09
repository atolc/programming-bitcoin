<!-- order: 8 -->

## Comisiones

Bitcoin no tiene un campo explícito de comisión. El minero cobra la diferencia:

$$\text{fee} = \sum \text{entradas} - \sum \text{salidas}$$

Ejemplo: gastas un UTXO de 100 000 satoshis y creas dos salidas de 40 000 y 30 000:

$$\text{fee} = 100\,000 - 70\,000 = 30\,000 \text{ satoshis}$$

```python-sandbox
input_total = 100_000
outputs = [40_000, 30_000]
fee = input_total - sum(outputs)
fee_rate = fee / 250  # suponiendo 250 vbytes
print(f"Comisión: {fee} sats ({fee_rate:.1f} sat/vB)")
---
Comisión: 30000 sats (120.0 sat/vB)
```

Los mineros priorizan transacciones con mayor **tasa de comisión por vbyte** (sat/vB). El tamaño en vbytes depende del peso de la transacción (post-SegWit usa *virtual size*).

> [!TIP]
> Si $\sum \text{salidas} > \sum \text{entradas}$, la transacción es inválida. Si la comisión es excesivamente alta, los nodos la aceptan igual; si es demasiado baja, puede quedarse en la mempool indefinidamente.
