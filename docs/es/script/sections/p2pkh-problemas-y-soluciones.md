<!-- order: 8 -->

## P2PKH: problemas y soluciones

**P2PKH** (*Pay-to-Public-Key-Hash*) bloquea fondos al hash160 de la llave pública en lugar de la llave completa:

$$\text{script\_pubkey} = \texttt{OP\_DUP}\,\|\,\texttt{OP\_HASH160}\,\|\,\text{push}(H_{160})\,\|\,\texttt{OP\_EQUALVERIFY}\,\|\,\texttt{OP\_CHECKSIG}$$

### Problema que resuelve

En P2PK, la llave pública queda expuesta en el `script_pubkey` desde el momento del cobro. En P2PKH solo se revela el hash de 20 bytes; la llave pública aparece en el `script_sig` **solo al gastar**.

### Flujo de validación

1. `script_sig` empuja firma y llave pública.
2. `OP_DUP` duplica la llave pública.
3. `OP_HASH160` calcula el hash.
4. Se compara con el hash embebido en `script_pubkey` (`OP_EQUALVERIFY`).
5. `OP_CHECKSIG` verifica la firma sobre la transacción.

```python-sandbox
# Verificación conceptual paso a paso
stack = ["sig", "pubkey"]
stack.append(stack[-1])          # OP_DUP
h = "hash160(pubkey)"            # OP_HASH160
stack.append(h)
embedded = "hash160(pubkey)"
assert stack.pop() == embedded     # OP_EQUALVERIFY
valid = "CHECKSIG(sig, pubkey)"  # OP_CHECKSIG
print("Gasto válido:", valid)
```

### Dirección P2PKH

La dirección que compartes es Base58Check de `0x00 || hash160`, no el script en bruto.

> [!TIP]
> P2PKH fue el estándar dominante hasta SegWit. Sigue siendo compatible y ampliamente usado en direcciones que empiezan por `1` en mainnet.

## Complemento de sección

P2PKH resuelve dos problemas prácticos de P2PK: usabilidad/tamaño de dirección y exposición de la llave pública antes de gastar. El receptor comparte una dirección Base58Check que representa un HASH160, y el gastador revela después la llave pública y la firma. El script verifica que la llave pública hashee al valor esperado antes de revisar la firma.

El orden de validación importa: duplicar la llave pública, hashearla, compararla con el hash comprometido y luego verificar la firma. OP_EQUALVERIFY combina comparación y fallo; OP_CHECKSIG solo corre si la identidad de la llave pasa.

