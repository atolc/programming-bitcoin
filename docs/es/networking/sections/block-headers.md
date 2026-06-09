<!-- order: 6 -->

## Encabezados de bloque en la red

Para sincronizar la cadena sin descargar bloques completos, un nodo envía **`getheaders`** indicando desde qué hash conocido quiere continuar y un hash de parada (`stop_hash`, a menudo ceros).

El peer responde con **`headers`**: una lista de encabezados de 80 bytes encadenados. Cada encabezado debe enlazar con el anterior (`prev_block`) y cumplir las reglas de PoW.

```
getheaders:
  [version]
  [cantidad de locators: varint]
    [hash del mejor bloque conocido]
    [hash anterior en la cadena, opcional]
  [stop_hash: 32 bytes]

headers:
  [cantidad de encabezados: varint]
    [header 1: 80 bytes]
    [tx_count: varint = 0]   # siempre 0 en este mensaje
    [header 2: 80 bytes]
    [tx_count: 0]
    ...
```

```python-sandbox
HEADER_SIZE = 80

def validate_chain_link(prev_hash: bytes, header: bytes) -> bool:
    # prev_block son los bytes 4:36 del encabezado
    return header[4:36] == prev_hash

prev = bytes.fromhex("00" * 32)
fake_header = b"\x00" * 4 + prev + b"\x00" * 44
print("Enlace valido?", validate_chain_link(prev, fake_header))
---
Enlace valido? True
```

Si la respuesta `headers` alcanza el límite del mensaje (~2000 encabezados), el cliente envía otro `getheaders` usando el último hash recibido como nuevo locator.

> [!TIP]
> Validar encabezados es mucho más ligero que validar bloques completos, pero un cliente SPV aún necesita pruebas Merkle para confiar en transacciones concretas. Eso es el tema del siguiente capítulo.
