<!-- order: 3 -->

## OP_CHECKMULTISIG

`OP_CHECKMULTISIG` verifica un esquema $m$-de-$n$:

1. Consume de la pila: $m$, las $m$ firmas, $n$, y las $n$ llaves públicas.
2. Comprueba que al menos $m$ firmas son válidas para las llaves correspondientes.
3. Empuja `1` (éxito) o `0` (fallo).

### El bug del off-by-one

Por un error de implementación original, `CHECKMULTISIG` consume un elemento extra de la pila que no usa. La convención es empujar `OP_0` (un byte nulo) al inicio del `script_sig`:

$$\text{script\_sig} = \texttt{OP\_0} \,\|\, \text{push}(\text{firma}_1) \,\|\, \cdots \,\|\, \text{push}(\text{firma}_m)$$

```python-sandbox
# Simulación conceptual de la pila antes de CHECKMULTISIG
stack = ["OP_0", "sig_a", "sig_b", "OP_2", "pub_a", "pub_b", "pub_c", "OP_3"]
# CHECKMULTISIG consume: OP_3, pub_c, pub_b, pub_a, OP_2, sig_b, sig_a, OP_0
consumed = 8
print(f"Elementos consumidos: {consumed} (incluye el dummy OP_0)")
print("Resultado: 1 si >= 2 firmas válidas")
```

> [!TIP]
> Este comportamiento es **intencionalmente preservado** por compatibilidad hacia atrás. Cualquier implementación moderna debe incluir el `OP_0` dummy al firmar multisig.
