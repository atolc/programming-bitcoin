<!-- order: 6 -->

## Combinar campos

Para **construir** un script a partir de comandos, el proceso inverso al parseo concatena opcodes y datos:

```python
def serialize_script(commands):
    result = b""
    for cmd in commands:
        if isinstance(cmd, int):
            result += bytes([cmd])
        elif isinstance(cmd, bytes):
            length = len(cmd)
            if length < 0x4c:
                result += bytes([length]) + cmd
            else:
                result += b"\x4c" + bytes([length]) + cmd
    return result
```

Ejemplo P2PKH: bloquear fondos a la dirección derivada de una llave pública.

$$\text{script\_pubkey} = \texttt{OP\_DUP}\,\|\,\texttt{OP\_HASH160}\,\|\,\text{push}(H_{160}(\text{pubkey}))\,\|\,\texttt{OP\_EQUALVERIFY}\,\|\,\texttt{OP\_CHECKSIG}$$

```python-sandbox
def push(data):
    return bytes([len(data)]) + data

hash160 = bytes.fromhex("89abcdefabbaabbaabbaabbaabbaabbaabbaabba")
script = bytes([0x76, 0xa9]) + push(hash160) + bytes([0x88, 0xac])
print("P2PKH script:", script.hex())
print("Longitud:", len(script), "bytes")
```

> [!TIP]
> El `script_sig` de un P2PKH típico es `push(firma_der) push(llave_publica_sec)`. Ambos scripts se serializan por separado y van en campos distintos de la transacción.

## Complemento de sección

Combinar campos significa tomar dos campos script serializados desde partes distintas del modelo de transacción y evaluarlos como un programa de autorización. El gastador controla script_sig; la salida previa controla script_pubkey. La validación solo tiene éxito si la combinación deja un resultado verdadero.

La frontera crucial es la firma. Para firmas heredadas, el script usado en el digest no es el script_sig de la transacción que se firma; es el script_pubkey de la salida previa para la entrada considerada. Así se evita que la firma se firme a sí misma.

