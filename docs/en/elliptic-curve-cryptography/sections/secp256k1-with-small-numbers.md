<!-- order: 4 -->

## secp256k1 with Small Numbers

Bitcoin uses an enormous prime, but the logic is the same over a small field. Let's simulate with $p = 223$:

```python-sandbox
p = 223
a = 0
b = 7

def on_curve(x, y):
    return (y * y - (x**3 + a * x + b)) % p == 0

G = (170, 142)
print("G on curve?", on_curve(*G))
---
G on curve? True
```

Bitcoin's actual curve is **secp256k1**:

- $p = 2^{256} - 2^{32} - 977$
- $a = 0$, $b = 7$
- Generator point $G$ with fixed coordinates published in the standards
