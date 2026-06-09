<!-- order: 3 -->

## Cómo funciona el Script

Al gastar un UTXO, el nodo concatena dos scripts y los evalúa como uno solo:

$$\text{script completo} = \text{script\_sig} \,\|\, \text{script\_pubkey}$$

1. Se ejecuta primero el `script_sig` (datos de desbloqueo: firmas, llaves).
2. Luego el `script_pubkey` (condiciones de bloqueo definidas al crear la salida).
3. Si el resultado final es verdadero, el gasto es válido.

Este diseño se llama **Pay-to-Script-Hash** en espíritu inverso: el `script_pubkey` se fija al recibir fondos; el `script_sig` se aporta al gastar.

```
script_sig:    <firma> <llave pública>
script_pubkey: OP_DUP OP_HASH160 <hash> OP_EQUALVERIFY OP_CHECKSIG
```

```python-sandbox
# Flujo simplificado P2PKH
script_sig = ["firma", "pubkey"]
script_pubkey = ["DUP", "HASH160", "abc123", "EQUALVERIFY", "CHECKSIG"]
full = script_sig + script_pubkey
print("Pasos a ejecutar:", len(full))
print("Orden:", " -> ".join(full[:3]) + " -> ...")
```

> [!TIP]
> Los nodos ejecutan el script en un entorno aislado con límite de operaciones (costo por opcode). Un script demasiado largo o costoso se rechaza antes de confirmarse en un bloque.
