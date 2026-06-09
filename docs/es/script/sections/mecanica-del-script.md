<!-- order: 2 -->

## Mecánica del Script

Bitcoin Script opera sobre dos pilas conceptuales durante la validación:

1. **Pila principal** (*stack*): donde se empujan y sacan valores.
2. **Pila alterna** (*altstack*): usada por pocos opcodes como `OP_TOALTSTACK`.

Cada opcode consume cero o más elementos de la pila y puede empujar resultados. La ejecución es **lineal**: se procesan los bytes del script de izquierda a derecha, opcode a opcode.

Una validación exitosa termina con el valor `1` (verdadero) en la cima de la pila y la pila alterna vacía.

```python-sandbox
stack = []
# Simular OP_2 OP_3 OP_ADD OP_5 OP_EQUAL
for val in [2, 3, "ADD", 5, "EQUAL"]:
    if val == "ADD":
        stack.append(stack.pop() + stack.pop())
    elif val == "EQUAL":
        stack.append(1 if stack.pop() == stack.pop() else 0)
    else:
        stack.append(val)
print("Cima de la pila:", stack[-1])
```

> [!TIP]
> Si en cualquier momento un opcode necesita más elementos de los disponibles, la ejecución falla inmediatamente.
