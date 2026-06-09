<!-- order: 5 -->

## Salidas

Cada salida (*output*) crea un nuevo UTXO:

```
[amount: 8 bytes, little-endian, en satoshis]
[longitud del script_pubkey: varint]
[script_pubkey: bytes]
```

El **amount** es un entero de 64 bits sin signo. Un bitcoin son $10^8$ satoshis:

$$1 \text{ BTC} = 100\,000\,000 \text{ satoshis}$$

El **script_pubkey** (*locking script*) define las condiciones para gastar esos satoshis. Hasta que alguien presente un `script_sig` (o `script_witness`) válido que lo satisfaga, los fondos permanecen bloqueados.

```python-sandbox
btc = 0.001
satoshis = int(btc * 100_000_000)
amount_bytes = satoshis.to_bytes(8, "little")
print(f"{btc} BTC = {satoshis} satoshis")
print("Amount serializado:", amount_bytes.hex())
```

> [!TIP]
> La suma de todas las salidas nunca puede superar la suma de las entradas. La diferencia es la comisión para el minero.
