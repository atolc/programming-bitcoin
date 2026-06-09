<!-- order: 2 -->

## Concepto de filtro Bloom

Un **filtro de Bloom** es una estructura probabilística que responde si un elemento **podría** estar en un conjunto. Permite **falsos positivos** (dice «sí» sin estar) pero no falsos negativos (si dice «no», seguro que no está).

Se implementa con un vector de bits y varias funciones hash. Para insertar un elemento se activan $k$ posiciones; para consultar se comprueban las mismas posiciones.

```python-sandbox
class BloomFilter:
    def __init__(self, size: int, num_functions: int):
        self.bits = [0] * size
        self.num_functions = num_functions

    def _indexes(self, item: bytes):
        import hashlib
        for i in range(self.num_functions):
            h = hashlib.sha256(item + bytes([i])).digest()
            yield int.from_bytes(h[:4], "big") % len(self.bits)

    def add(self, item: bytes):
        for idx in self._indexes(item):
            self.bits[idx] = 1

    def probably_contains(self, item: bytes) -> bool:
        return all(self.bits[idx] for idx in self._indexes(item))

bf = BloomFilter(64, 3)
bf.add(b"mi_direccion")
print(bf.probably_contains(b"mi_direccion"))
print(bf.probably_contains(b"otra"))
```

Para wallets SPV, el filtro representa las direcciones o scripts que te interesan. El nodo completo compara cada transacción del bloque contra el filtro y solo te reenvía coincidencias probables.

> [!TIP]
> A más elementos insertados o menos bits, sube la tasa de falsos positivos: recibirás transacciones ajenas y gastarás más ancho de banda.
