<!-- order: 4 -->

## Opcodes

Cada byte en un script es un **opcode**. Algunos empujan datos, otros realizan operaciones.

### Empuje de constantes

| Opcode | Hex | Efecto |
|--------|-----|--------|
| `OP_0` | `0x00` | Empuja 0 |
| `OP_1` … `OP_16` | `0x51`–`0x60` | Empuja 1…16 |
| `OP_PUSHDATA` | `0x4c`–`0x4e` | Empuja N bytes siguientes |

### Criptografía y comparación

| Opcode | Hex | Efecto |
|--------|-----|--------|
| `OP_DUP` | `0x76` | Duplica el tope de la pila |
| `OP_HASH160` | `0xa9` | SHA-256 + RIPEMD-160 del tope |
| `OP_EQUALVERIFY` | `0x88` | Compara dos elementos; falla si no son iguales |
| `OP_CHECKSIG` | `0xac` | Verifica firma ECDSA |

```python-sandbox
OPCODES = {
    0x00: "OP_0", 0x51: "OP_1", 0x76: "OP_DUP",
    0xa9: "OP_HASH160", 0x88: "OP_EQUALVERIFY", 0xac: "OP_CHECKSIG",
}
script_hex = "76a914"  # OP_DUP OP_HASH160 PUSH(20)
for b in bytes.fromhex(script_hex):
    print(f"0x{b:02x} -> {OPCODES.get(b, 'PUSHDATA/otro')}")
```

> [!TIP]
> Los opcodes deshabilitados (`OP_CAT`, `OP_SUBSTR`, etc.) existen en la tabla pero provocan fallo inmediato si se usan. Esto limita deliberadamente la expresividad del lenguaje.

## Complemento de sección

Los opcodes son instrucciones a nivel de byte, así que el parser debe tratarlos primero como enteros y luego como nombres. Algunos empujan constantes, otros datos crudos, otros transforman elementos de la pila y otros hacen verificaciones que pueden fallar todo el script. Los opcodes deshabilitados no deben implementarse accidentalmente como activos.

Para aprender, agrupa opcodes por efecto: empujar, duplicar, hashear, comparar, aritmética, verificación de firmas y control. Los scripts de estos capítulos usan un subconjunto pequeño, pero el evaluador debe diseñarse para añadir opcodes mediante una tabla, no reescribiendo todo.

