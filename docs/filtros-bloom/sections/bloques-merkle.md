<!-- order: 5 -->

## Obtener bloques Merkle

Con el filtro activo, la wallet solicita bloques mediante **`getdata`** pidiendo objetos de tipo **`MSG_MERKLEBLOCK`** (valor 4 en BIP37). El nodo responde con un `merkleblock` que incluye solo las ramas Merkle necesarias para las transacciones que coinciden con el filtro.

Flujo:

1. Peer anuncia un nuevo bloque con `inv` (tipo `MSG_BLOCK` o `MSG_FILTERED_BLOCK`).
2. Wallet envía `getdata` pidiendo `MSG_MERKLEBLOCK` para ese hash.
3. Nodo devuelve `merkleblock` + (opcionalmente) transacciones coincidentes en mensajes `tx` separados.

```python-sandbox
MSG_MERKLEBLOCK = 4
MSG_TX = 1

request = {"type": MSG_MERKLEBLOCK, "hash": "abc123..."}
print(f"Solicitando tipo {request['type']} (merkleblock)")
---
Solicitando tipo 4 (merkleblock)
```

La wallet reconstruye la raíz Merkle del `merkleblock` y la compara con el encabezado que ya tiene de la cadena SPV.

> [!TIP]
> Si el `merkleblock` no incluye una transacción que esperabas, puede ser falso negativo del filtro (no debería ocurrir) o que la transacción no esté en ese bloque. Verifica el hash del bloque y la altura.
