<!-- order: 4 -->

## P2SH (Pay-to-Script-Hash)

P2SH bloquea fondos al hash160 de un **script de redención** (*redeem script*), no al script en sí:

$$\text{script\_pubkey} = \texttt{OP\_HASH160} \,\|\, \text{push}(H_{160}(\text{redeem script})) \,\|\, \texttt{OP\_EQUAL}$$

Ventajas:

- El pagador solo necesita una dirección corta (empieza por `3` en mainnet).
- La lógica compleja (multisig, HTLC, etc.) queda oculta hasta el gasto.
- El UTXO set almacena un script fijo de 23 bytes.

Al **gastar**, el flujo es:

1. `script_sig` empuja los datos de redención (firmas, etc.) y el redeem script completo.
2. `script_pubkey` hashea el redeem script y compara con el hash embebido.
3. Si coincide, el redeem script se evalúa como si fuera el `script_pubkey` original.

```python-sandbox
redeem_script = "OP_2 pubkey_A pubkey_B OP_2 OP_CHECKMULTISIG"
hash160 = "a1b2c3..."  # hash160(redeem_script)
script_pubkey = f"OP_HASH160 {hash160} OP_EQUAL"
print("script_pubkey P2SH:", script_pubkey)
print("Dirección mainnet empieza por: 3")
```

> [!TIP]
> El prefijo Base58Check para P2SH en mainnet es `0x05` (direcciones que empiezan por `3`). En testnet es `0xc4`.
