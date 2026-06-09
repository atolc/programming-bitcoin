<!-- order: 3 -->

## Árbol de Merkle: padre, nivel y raíz

Las transacciones de un bloque se organizan en un **árbol de Merkle** binario. Cada hoja es el hash de una transacción (doble SHA-256). Cada nodo interno es el hash de la concatenación de sus dos hijos:

$$\text{parent}(h_L, h_R) = \text{SHA256}(\text{SHA256}(h_L \parallel h_R))$$

Si hay un número impar de nodos en un nivel, el último se **duplica** antes de emparejar.

```python-sandbox
import hashlib

def merkle_parent(h1: bytes, h2: bytes) -> bytes:
    return hashlib.sha256(hashlib.sha256(h1 + h2).digest()).digest()

def merkle_level(hashes):
    if len(hashes) == 1:
        return hashes
    if len(hashes) % 2 == 1:
        hashes = hashes + [hashes[-1]]
    return [merkle_parent(hashes[i], hashes[i+1]) for i in range(0, len(hashes), 2)]

tx_hashes = [bytes([i]) * 32 for i in range(4)]
level1 = merkle_level(tx_hashes)
root = merkle_level(level1)[0]
print("Raiz:", root[:4].hex())
```

La **raíz Merkle** (`merkle_root`) se guarda en el encabezado del bloque. Cambiar cualquier transacción altera la raíz y, por tanto, el hash del bloque.

Una **prueba Merkle** para la transacción $T$ consiste en los hashes hermanos del camino desde la hoja de $T$ hasta la raíz. Con esos hashes el cliente recalcula la raíz y la compara con la del encabezado que ya validó.

> [!TIP]
> El orden de las transacciones en el bloque importa: la posición de tu transacción determina qué hashes hermanos necesitas en la prueba.

## Complemento de sección

Los árboles Merkle comprimen muchos hashes de transacción en una raíz. Los padres se calculan concatenando dos hijos y aplicando HASH256. Cuando un nivel tiene cantidad impar de hashes, se duplica el último para que cada padre tenga dos hijos.

La raíz es sensible tanto al contenido como al orden de las transacciones. Reordenarlas cambia los emparejamientos y por tanto la raíz. Por eso un encabezado de bloque puede comprometer una lista ordenada completa de transacciones con solo 32 bytes.

