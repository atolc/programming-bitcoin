<!-- order: 3 -->

## BIP37: filtros Bloom

El **BIP37** define cómo wallets ligeras usan filtros Bloom con nodos que anuncian el servicio `NODE_BLOOM`.

Parámetros del filtro:

| Campo | Significado |
|-------|-------------|
| `filter_bytes` | Tamaño del vector de bits |
| `nHashFuncs` | Número de funciones hash (máx. 50) |
| `nTweak` | Semilla para derivar las funciones |
| `nFlags` | `BLOOM_UPDATE_NONE`, `_ALL`, `_P2PUBKEY_ONLY` |

Los nodos usan **murmur3** con el `nTweak` para calcular las posiciones de cada elemento. Al añadir una transacción al bloque, el nodo evalúa si algún byte relevante (salidas, inputs, witness) coincide con el filtro.

```python-sandbox
BLOOM_UPDATE_NONE = 0
BLOOM_UPDATE_ALL = 1
BLOOM_UPDATE_P2PUBKEY_ONLY = 2

filter_params = {
    "size": 36000,
    "nHashFuncs": 7,
    "nTweak": 0x12345678,
    "nFlags": BLOOM_UPDATE_P2PUBKEY_ONLY,
}
print(f"Filtro: {filter_params['size']} bytes, {filter_params['nHashFuncs']} funciones")
---
Filtro: 36000 bytes, 7 funciones
```

> [!TIP]
> BIP37 ha perdido popularidad frente a BIP157/158 (filtros compactos por bloque) porque un nodo malicioso puede inferir direcciones correlacionando filtros. Aun así, entender BIP37 es clave para leer código legacy y el libro.
