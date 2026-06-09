<!-- order: 5 -->

## Fields When Parsing

A raw script is a sequence of bytes. When parsing it we distinguish:

1. **Single-byte opcode** (`0x00`–`0x4b` push directly; `0x4c`–`0x4e` indicate length).
2. **Pushed data** (length + bytes).

Direct push rules:

- If byte $b$ satisfies $0x01 \leq b \leq 0x4b$, push exactly the following $b$ bytes.
- `0x00` (`OP_0`) pushes an empty string (interpreted as false in some contexts).

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
> When serializing, always choose the most compact form: if your data is 3 bytes, use opcode `0x03` instead of `OP_PUSHDATA1`.
