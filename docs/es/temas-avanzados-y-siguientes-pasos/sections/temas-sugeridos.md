<!-- order: 2 -->

## Temas sugeridos para seguir estudiando

El libro cubre el núcleo de un nodo y una wallet; Bitcoin en producción añade capas que merece la pena explorar:

| Tema | Por qué importa |
|------|-----------------|
| **Taproot (BIP341/342)** | Direcciones `bc1p`, Schnorr, MAST, mejor privacidad y eficiencia |
| **Lightning Network** | Pagos fuera de cadena con contratos HTLC y routing |
| **BIP32 / BIP39 / BIP44** | HD wallets, mnemonicos y derivación de claves |
| **PSBT (BIP174)** | Intercambio parcial de transacciones entre firmantes |
| **Compact blocks (BIP152)** | Propagación eficiente de bloques entre nodos |
| **Filtros compactos (BIP157/158)** | Alternativa moderna a BIP37 para clientes ligeros |

```python-sandbox
topics = ["Taproot", "Lightning", "PSBT", "BIP158"]
for i, topic in enumerate(topics, 1):
    print(f"{i}. {topic}")
---
1. Taproot
2. Lightning
3. PSBT
4. BIP158
```

> [!TIP]
> Lee las BIPs en [github.com/bitcoin/bips](https://github.com/bitcoin/bips) después de implementar la idea en código. La especificación y la práctica se refuerzan mutuamente.
