<!-- order: 2 -->

## Transacción coinbase

Cada bloque contiene una o más transacciones. La **primera** siempre es la transacción **coinbase**: no consume UTXOs previos y crea satoshis nuevos como recompensa de minería más las comisiones de las demás transacciones del bloque.

Estructura simplificada:

```
[versión]
[1 entrada coinbase]
  prev_tx: 32 bytes de ceros
  prev_index: 0xffffffff
  script_sig: datos arbitrarios del minero (altura del bloque, mensaje, etc.)
  sequence: 0xffffffff
[cantidad de salidas: normalmente 1 o más]
[locktime: 0]
```

La suma de las salidas coinbase debe ser **≤** recompensa del bloque + comisiones. Si excede ese límite, el bloque es inválido.

```python-sandbox
BLOCK_SUBSIDY = 50 * 10**8  # 50 BTC en satoshis (bloque génesis)
fees = 125_000
coinbase_output = BLOCK_SUBSIDY + fees
print(f"Salida coinbase maxima: {coinbase_output} sat")
```

Desde **BIP34**, los mineros incluyen la altura del bloque al inicio del `script_sig` coinbase. Eso evita duplicar coinbases idénticas entre bloques distintos.

> [!TIP]
> El `script_sig` coinbase es el único lugar donde un minero puede escribir un mensaje arbitrario (como el titular del Times en el bloque génesis). No afecta la validación económica, pero debe respetar las reglas de tamaño del bloque.

## Complemento de sección

La transacción coinbase es la única transacción de un bloque que no gasta una salida anterior. Crea monedas nuevas hasta el subsidio actual más las comisiones de las transacciones incluidas. Su hash previo son ceros y su índice previo es 0xffffffff, lo que permite reconocerla al parsear.

BIP34 añade la altura del bloque al inicio del script_sig coinbase. Esto evita txids coinbase duplicados entre bloques y da a los parsers un campo relevante de consenso para extraer. Los datos coinbase pueden incluir mensajes del minero, pero siguen teniendo restricciones de tamaño y validez.

