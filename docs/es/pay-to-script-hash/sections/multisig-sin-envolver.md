<!-- order: 2 -->

## Multisig sin envolver (bare multisig)

Un script **multisig** $m$-de-$n$ exige $m$ firmas válidas de un conjunto de $n$ llaves públicas:

$$\texttt{OP\_}m \,\|\, \text{push}(\text{pubkey}_1) \,\|\, \cdots \,\|\, \text{push}(\text{pubkey}_n) \,\|\, \texttt{OP\_}n \,\|\, \texttt{OP\_CHECKMULTISIG}$$

En formato *bare* (sin envolver), este script completo va directamente en el `script_pubkey`. Al gastar, el `script_sig` aporta las firmas y un byte extra histórico.

Problemas del bare multisig:

- El pagador debe conocer todas las llaves y el valor $m$.
- El `script_pubkey` es largo (muchas llaves públicas embebidas).
- La dirección resultante no cabe en el formato P2PKH estándar.

```python-sandbox
m, n = 2, 3
pubkeys = [f"pubkey_{i}" for i in range(n)]
bare_script = [f"OP_{m}"] + pubkeys + [f"OP_{n}", "OP_CHECKMULTISIG"]
print("Bare multisig:", " ".join(bare_script))
print(f"Elementos en script_pubkey: {len(bare_script)}")
```

> [!TIP]
> Bare multisig solo es práctico para casos muy simples. Para pagos cotidianos, P2SH (o SegWit) es el estándar.

## Complemento de sección

Bare multisig demuestra que Script puede expresar autorización mediante varias llaves, pero también muestra por qué los scripts complejos crudos son incómodos. El pagador debe poner todo el programa multisig en el conjunto UTXO, incluyendo cada llave pública. Eso aumenta el tamaño de la salida y expone la política de gasto de inmediato.

La forma de la pila también es fácil de equivocarse. CHECKMULTISIG espera firmas y llaves públicas en un orden específico, más el elemento dummy histórico. Probar ejemplos m-de-n pequeños ayuda a ver si tu evaluador consume la pila correctamente.

