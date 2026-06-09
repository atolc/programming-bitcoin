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

## Complemento de sección

Locktime es absoluto y condicional. Valores menores que 500,000,000 se interpretan como alturas de bloque; valores iguales o mayores se interpretan como timestamps Unix. Pero locktime solo tiene efecto si al menos una entrada tiene sequence no final. Si todos los sequence son 0xffffffff, el locktime heredado se ignora.

Este campo muestra bien el contexto de consenso: los mismos 4 bytes pueden no significar nada o ser vinculantes según los sequence y el estado de la cadena. El código debe parsearlo mecánicamente y dejar la interpretación a la validación con acceso a la transacción y la cadena.

