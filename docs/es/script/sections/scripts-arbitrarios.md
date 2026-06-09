<!-- order: 9 -->

## Scripts arbitrarios

Bitcoin permite scripts personalizados más allá de P2PK y P2PKH, siempre que respeten las reglas de consenso:

- Tamaño máximo del `script_pubkey`: 10 000 bytes.
- Tamaño máximo del `script_sig`: antes limitado; con SegWit, el witness tiene su propio límite.
- Opcodes deshabilitados no pueden usarse.
- El script debe terminar con resultado verdadero en la pila.

Ejemplos históricos:

| Tipo | Idea |
|------|------|
| Multisig | Requiere $m$-de-$n$ firmas |
| HTLC | Bloqueo con hash preimage + timeout |
| Puzzles | Resolver un acertijo matemático para reclamar fondos |

```python-sandbox
# Puzzle simple: OP_HASH160 <hash> OP_EQUAL
# Solo quien conozca la preimagen puede gastar
import hashlib

def hash160(data):
    return hashlib.new("ripemd160", hashlib.sha256(data).digest()).digest()

secret = b"hola"
h = hash160(secret)
print("Hash del puzzle:", h.hex())
print("Preimagen válida:", hash160(b"hola") == h)
```

> [!TIP]
> Los scripts arbitrarios "en bruto" (*bare*) exponen la lógica completa en el `script_pubkey`, lo que aumenta el tamaño de la UTXO set y complica la validación. Por eso nació P2SH, tema del capítulo 8.

## Complemento de sección

Bitcoin permite más que las plantillas estándar comunes, pero policy y consenso son capas distintas. Un script puede ser válido por consenso y aun así no estándar para relay o minería. Esta distinción mantiene estable el lenguaje de consenso mientras desalienta salidas costosas, riesgosas o difíciles de propagar.

Los scripts arbitrarios también motivan P2SH. Si la lógica compleja vive directamente en script_pubkey, todos los nodos completos deben guardarla en el conjunto UTXO antes de que se gasten las monedas. P2SH mantiene pequeño el UTXO y revela la complejidad solo al gastar.

