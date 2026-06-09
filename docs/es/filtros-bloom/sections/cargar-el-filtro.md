<!-- order: 4 -->

## Cargar el filtro

La wallet envía un mensaje **`filterload`** con el filtro serializado. A partir de ese momento, el peer asocia tu conexión con ese filtro Bloom.

```
filterload:
  [filter_bytes: varint + bytes del vector de bits]
  [nHashFuncs: 4 bytes]
  [nTweak: 4 bytes]
  [nFlags: 1 byte]
```

Tras cargar el filtro, la wallet suele enviar **`filteradd`** cada vez que deriva una nueva clave o dirección, y **`filterclear`** para vaciarlo.

```python-sandbox
def build_filterload(filter_bytes: bytes, n_hash: int, tweak: int, flags: int) -> dict:
    return {
        "command": "filterload",
        "filter_bytes": filter_bytes,
        "nHashFuncs": n_hash,
        "nTweak": tweak,
        "nFlags": flags,
    }

msg = build_filterload(b"\x00" * 8, 5, 42, 0)
print(msg["command"], len(msg["filter_bytes"]))
```

El nodo solo aplica el filtro a conexiones que lo hayan cargado explícitamente. Sin `filterload`, seguirás recibiendo solo `inv` genéricos.

> [!TIP]
> Regenera el filtro periódicamente o usa `filterclear` + `filterload` para limitar cuánto puede aprender un observador sobre tu conjunto de direcciones.
