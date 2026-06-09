<!-- order: 2 -->

## Script Mechanics

Bitcoin Script operates on two conceptual stacks during validation:

1. **Main stack** (*stack*): where values are pushed and popped.
2. **Alt stack** (*altstack*): used by a few opcodes such as `OP_TOALTSTACK`.

Each opcode consumes zero or more elements from the stack and may push results. Execution is **linear**: script bytes are processed left to right, opcode by opcode.

A successful validation ends with the value `1` (true) on top of the main stack and the alt stack empty.

```python-sandbox
stack = []
# Simulate OP_2 OP_3 OP_ADD OP_5 OP_EQUAL
for val in [2, 3, "ADD", 5, "EQUAL"]:
    if val == "ADD":
        stack.append(stack.pop() + stack.pop())
    elif val == "EQUAL":
        stack.append(1 if stack.pop() == stack.pop() else 0)
    else:
        stack.append(val)
print("Top of stack:", stack[-1])
```

> [!TIP]
> If at any point an opcode needs more elements than are available, execution fails immediately.

## Section Completion

Script evaluation is deterministic stack execution. Each command consumes zero or more stack elements and may push results back. A command that needs more elements than the stack contains fails immediately. This makes stack discipline more important than syntax: a script can parse correctly and still be invalid because the stack shape is wrong.

The alternate stack exists but is rarely needed in standard scripts. For the book's implementation, focus on the main stack, truthiness rules, and early failure. Once those are reliable, cryptographic opcodes can be added as specialized stack operations.

