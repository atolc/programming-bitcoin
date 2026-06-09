<!-- order: 5 -->

## Campos al parsear

Un script en bruto es una secuencia de bytes. Al parsearlo distinguimos:

1. **Opcode de un byte** (`0x00`–`0x4b` empujan directamente; `0x4c`–`0x4e` indican longitud).
2. **Datos empujados** (longitud + bytes).

Reglas de empuje directo:

- Si el byte $b$ cumple $0x01 \leq b \leq 0x4b$, empuja exactamente $b$ bytes siguientes.
- `0x00` (`OP_0`) empuja una cadena vacía (interpretada como falso en algunos contextos).

```python
def parse_script(raw):
    i = 0
    commands = []
    while i < len(raw):
        op = raw[i]
        i += 1
        if 1 <= op <= 0x4b:
            data = raw[i:i + op]
            commands.append(data)
            i += op
        elif op == 0x00:
            commands.append(b"")
        else:
            commands.append(op)
    return commands
```

```python-sandbox
# OP_DUP (0x76) + OP_HASH160 (0xa9) + PUSH 3 bytes "abc"
raw = bytes.fromhex("76a903616263")
ops = []
i = 0
while i < len(raw):
    b = raw[i]; i += 1
    if 1 <= b <= 0x4b:
        ops.append(raw[i:i+b]); i += b
    else:
        ops.append(f"0x{b:02x}")
print(ops)
```

> [!TIP]
> Al serializar, elige siempre la forma más compacta: si tus datos tienen 3 bytes, usa el opcode `0x03` en lugar de `OP_PUSHDATA1`.

## Complemento de sección

Parsear Script es distinto de parsear campos fijos de transacción porque el significado depende del byte opcode. Valores de 0x01 a 0x4b no son operaciones con nombre; son longitudes para empujes de datos inmediatos. OP_PUSHDATA1, OP_PUSHDATA2 y OP_PUSHDATA4 extienden esa idea para cadenas de bytes más largas.

Un parser correcto consume exactamente la cantidad anunciada y rechaza scripts truncados. Debe guardar datos empujados como bytes, no como strings hex, porque hashes y firmas posteriores operan sobre bytes crudos.

