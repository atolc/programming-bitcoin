<!-- order: 3 -->

## Creación de transacciones

Crear una transacción P2PKH sigue estos pasos:

### 1. Seleccionar UTXOs

Elige entradas que cubran el monto a enviar más la comisión deseada.

### 2. Construir salidas

- Salida al destinatario (monto acordado).
- Salida de cambio a tu propia dirección (si sobra).

### 3. Calcular el digest de firma

Se serializa una versión especial de la transacción:

- `script_sig` de la entrada que firmas se reemplaza por el `script_pubkey` del UTXO gastado.
- Los demás `script_sig` quedan vacíos.
- Se añade el byte `SIGHASH` al final.

$$\text{digest} = \text{SHA256}(\text{SHA256}(\text{tx para firmar}))$$

### 4. Firmar y ensamblar

Firma el digest con tu llave privada (ECDSA) y construye:

$$\text{script\_sig} = \text{push}(\text{firma DER} + \text{SIGHASH}) \,\|\, \text{push}(\text{llave pública SEC})$$

```python-sandbox
SIGHASH_ALL = 1

def sighash_byte(flag):
    return bytes([flag])

digest = bytes.fromhex("deadbeef" * 8)  # placeholder
sig_der = bytes.fromhex("3045022100ab" + "00" * 20)
script_sig_len = len(sig_der) + 1 + 33  # firma+sighash + pubkey comprimida
print(f"SIGHASH flag: {SIGHASH_ALL}")
print(f"script_sig aprox: {script_sig_len} bytes")
```

> [!TIP]
> `SIGHASH_ALL` (valor 1) firma todas las entradas y salidas. Otras variantes (`SIGHASH_NONE`, `SIGHASH_SINGLE`, combinadas con `ANYONECANPAY`) permiten contratos más flexibles pero son raras en wallets estándar.

## Complemento de sección

Crear una transacción es un proceso por etapas: elegir UTXO gastables, decidir salida del destinatario y cambio, estimar comisión, construir una transacción sin firmar, firmar cada entrada y serializar los bytes finales. Cada entrada recibe su propia firma porque cada digest de firma compromete un contexto de entrada distinto.

El manejo del cambio es parte de la corrección, no un detalle cosmético de wallet. Si las entradas elegidas superan monto de destino más comisión, el resto debe ser salida de cambio o comisión. Reutilizar dirección de origen o destino para cambio filtra estructura de wallet; se prefieren direcciones nuevas.

