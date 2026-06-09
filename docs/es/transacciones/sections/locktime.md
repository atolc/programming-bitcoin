<!-- order: 6 -->

## Locktime

El campo **locktime** (4 bytes, little-endian) al final de la transacción impone una restricción temporal o de altura de bloque antes de que la transacción sea válida en un bloque.

| Rango de locktime | Interpretación |
|-------------------|----------------|
| $< 500\,000\,000$ | Altura mínima de bloque |
| $\geq 500\,000\,000$ | Timestamp UNIX mínimo |

Un locktime de **0** significa que la transacción puede incluirse en el siguiente bloque disponible.

```python-sandbox
LOCKTIME_THRESHOLD = 500_000_000

def interpret_locktime(lt):
    if lt == 0:
        return "sin restricción"
    if lt < LOCKTIME_THRESHOLD:
        return f"bloque >= {lt}"
    return f"timestamp >= {lt}"

for lt in [0, 250000, 600_000_000]:
    print(f"locktime {lt}: {interpret_locktime(lt)}")
```

> [!TIP]
> El locktime absoluto se complementa con **sequence** y `nSequence` para bloqueos relativos (BIP 68/112). Una entrada con `sequence < 0xffffffff` puede activar reglas adicionales.
