<!-- order: 4 -->

## Prueba de trabajo

La **prueba de trabajo** (Proof-of-Work) exige que el hash del encabezado sea menor que un **target** dado por la red. Formalmente:

$$\text{block\_hash} < \text{target}$$

El campo `bits` del encabezado codifica el target en notación compacta (similar a la notación científica). A mayor dificultad, menor es el target y más difícil encontrar un nonce válido.

```python-sandbox
def bits_to_target(bits: int) -> int:
    exponent = bits >> 24
    coefficient = bits & 0xffffff
    return coefficient * (256 ** (exponent - 3))

bits = 0x1d00ffff  # bits del bloque génesis
target = bits_to_target(bits)
print(f"Target (primeros digitos): {str(target)[:20]}...")
---
Target (primeros digitos): 269595352910004905...
```

El minero prueba distintos valores de `nonce` (y también puede modificar datos extra en la coinbase) hasta obtener un hash por debajo del target. Verificar un bloque es barato: basta recalcular el hash y comparar.

La **dificultad** se ajusta cada 2016 bloques (~2 semanas) para mantener un tiempo medio de ~10 minutos por bloque:

$$\text{nueva\_dificultad} = \text{dificultad\_anterior} \times \frac{\text{tiempo\_real}}{ \text{tiempo\_esperado}}$$

> [!TIP]
> PoW no «resuelve un puzzle matemático útil»: convierte la creación de bloques en un proceso probabilístico costoso en energía, lo que hace prohibitivo reescribir la historia de la cadena sin controlar la mayoría del hashrate.
