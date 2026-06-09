<!-- order: 7 -->

## P2PK (Pay-to-Public-Key)

El formato más antiguo bloquea fondos directamente a una llave pública:

$$\text{script\_pubkey} = \text{push}(\text{llave pública SEC}) \,\|\, \texttt{OP\_CHECKSIG}$$

Al gastar, el `script_sig` solo necesita la firma:

$$\text{script\_sig} = \text{push}(\text{firma DER})$$

```python-sandbox
# P2PK en hex (esquema)
pubkey = bytes.fromhex("02" + "ab" * 32)  # SEC comprimida de ejemplo
script_pubkey = bytes([len(pubkey)]) + pubkey + bytes([0xac])  # OP_CHECKSIG
print("P2PK script_pubkey:", script_pubkey.hex()[:40] + "...")
print("Tamaño:", len(script_pubkey), "bytes")
```

Satoshi usó P2PK en las recompensas de bloque de los primeros años. Hoy está obsoleto para pagos normales porque:

- Expone la llave pública completa en la cadena (menor privacidad).
- Los scripts son más largos que P2PKH para el mismo propósito.

> [!TIP]
> P2PK sigue siendo relevante conceptualmente: `OP_CHECKSIG` es el corazón de casi todos los tipos de salida posteriores.

## Complemento de sección

P2PK bloquea monedas directamente a una llave pública y pide al gastador una firma válida. Es simple e históricamente importante, pero expone la llave pública desde que se crea la salida. Por eso los scripts estándar posteriores prefieren hashes de llaves públicas hasta el momento del gasto.

En implementación, P2PK es útil porque aísla OP_CHECKSIG. Si puedes alimentar OP_CHECKSIG con una firma, una llave pública SEC y el z correcto, ya tienes el núcleo criptográfico necesario para P2PKH y scripts posteriores.

