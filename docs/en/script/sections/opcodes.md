<!-- order: 4 -->

## Opcodes

Each byte in a script is an **opcode**. Some push data, others perform operations.

### Pushing constants

| Opcode | Hex | Effect |
|--------|-----|--------|
| `OP_0` | `0x00` | Pushes 0 |
| `OP_1` … `OP_16` | `0x51`–`0x60` | Pushes 1…16 |
| `OP_PUSHDATA` | `0x4c`–`0x4e` | Pushes the following N bytes |

### Cryptography and comparison

| Opcode | Hex | Effect |
|--------|-----|--------|
| `OP_DUP` | `0x76` | Duplicates the top of the stack |
| `OP_HASH160` | `0xa9` | SHA-256 + RIPEMD-160 of the top |
| `OP_EQUALVERIFY` | `0x88` | Compares two elements; fails if they are not equal |
| `OP_CHECKSIG` | `0xac` | Verifies ECDSA signature |

```python-sandbox
OPCODES = {
    0x00: "OP_0", 0x51: "OP_1", 0x76: "OP_DUP",
    0xa9: "OP_HASH160", 0x88: "OP_EQUALVERIFY", 0xac: "OP_CHECKSIG",
}
script_hex = "76a914"  # OP_DUP OP_HASH160 PUSH(20)
for b in bytes.fromhex(script_hex):
    print(f"0x{b:02x} -> {OPCODES.get(b, 'PUSHDATA/other')}")
```

> [!TIP]
> Disabled opcodes (`OP_CAT`, `OP_SUBSTR`, etc.) exist in the table but cause immediate failure if used. This deliberately limits the expressiveness of the language.
