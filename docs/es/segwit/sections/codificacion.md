<!-- order: 6 -->

## Codificación SegWit

Las transacciones SegWit usan el marcador de extensión: `version`, luego **`0x00 0x01`** (flag + witness marker), seguido de inputs/outputs normales y, al final, un **witness** por cada input.

```
[version: 4]
[marker: 0x00]
[flag: 0x01]
[inputs...]
[outputs...]
[witness por cada input:
   [num_stack_items: varint]
     [item1: varint len + bytes]
     ...
]
[locktime: 4]
```

El **txid** se calcula **sin** el witness (como si fuera una transacción legacy). El **wtxid** incluye el witness y se usa en el árbol de Merkle de witness del bloque.

```python-sandbox
def tx_weight(base_bytes: int, witness_bytes: int) -> int:
    return base_bytes * 4 + witness_bytes

base, witness = 100, 65
print(f"Weight: {tx_weight(base, witness)} vbytes equiv: {tx_weight(base, witness) / 4:.1f}")
---
Weight: 465 vbytes equiv: 116.2
```

La comisión efectiva se expresa en **sat/vbyte** usando el weight dividido por 4.

> [!TIP]
> Al serializar para firmar, cada input SegWit usa `SIGHASH_ALL` sobre el nuevo formato BIP143, que evita copiar scripts de otras entradas y reduce la maleabilidad.
