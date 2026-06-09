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

## Complemento de sección

Una salida es donde el valor de Bitcoin queda gastable bajo una nueva condición. El monto es un entero little-endian sin signo de 8 bytes medido en satoshis, no en BTC. El script_pubkey es datos de script con prefijo de longitud; puede corresponder a una dirección conocida, pero la transacción cruda guarda el script, no la dirección.

La validación revisa los montos con cuidado. Montos negativos son imposibles a nivel de bytes, pero pueden aparecer si el código usa enteros con signo incorrectamente. Valores por encima de la oferta total o sumas que desbordan deben rechazarse. Por eso la aritmética entera exacta importa en todo el parseo.

