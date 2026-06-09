<!-- order: 4 -->

## Proyectos sugeridos

Consolidar lo aprendido con proyectos pequeños pero completos:

1. **Cliente SPV mínimo** — Conecta a testnet, descarga encabezados, verifica Merkle proofs de una tx conocida.
2. **Minero de juguete** — Busca nonce válido en regtest con dificultad baja; imprime hashes por segundo.
3. **Parser de bloques** — Lee `blk*.dat` de Bitcoin Core y lista txids y coinbase.
4. **Wallet HD** — Deriva claves BIP32, genera direcciones p2wpkh y firma una tx de testnet.
5. **Explorador local** — API HTTP que consulta tu nodo por RPC y muestra bloques recientes.

```python-sandbox
projects = {
    "spv_client": "headers + merkleblock",
    "toy_miner": "regtest + PoW loop",
    "block_parser": "blk.dat reader",
}
for name, scope in projects.items():
    print(f"{name}: {scope}")
---
spv_client: headers + merkleblock
toy_miner: regtest + PoW loop
block_parser: blk.dat reader
```

Empieza por **regtest** o **testnet**: puedes minar bloques al instante y no arriesgas fondos reales. Usa `bitcoin-cli` o tu propia serialización para comparar resultados byte a byte.

> [!TIP]
> Publica el código en GitHub con README y tests. Explicar en voz alta cómo validas una transacción es una de las mejores comprobaciones de que realmente entiendes el flujo.
