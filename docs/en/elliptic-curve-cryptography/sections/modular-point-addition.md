<!-- order: 3 -->

## Modular Point Addition

The addition and doubling formulas are identical to those in the previous chapter, but each operation is done **modulo $p$**, and division is replaced by multiplication by the modular inverse.

```python-sandbox
p = 223
a, b = 0, 7

def inv(n):
    return pow(n, p - 2, p)

def add(P, Q):
    if P is None: return Q
    if Q is None: return P
    x1, y1 = P
    x2, y2 = Q
    if x1 == x2 and y1 != y2:
        return None
    if P != Q:
        lam = ((y2 - y1) * inv(x2 - x1)) % p
    else:
        lam = ((3*x1*x1 + a) * inv(2*y1)) % p
    x3 = (lam*lam - x1 - x2) % p
    y3 = (lam*(x1 - x3) - y1) % p
    return (x3, y3)

G = (170, 142)
P = add(G, G)
print("2G =", P)
```

### Encoding the Formulas with Field Elements

The book's implementation reuses the Chapter 1 `FieldElement` operations so `Point.__add__` no longer needs to know how modular division works.

```python-sandbox
class FieldElement:
    def __init__(self, num, prime):
        if num < 0 or num >= prime:
            raise ValueError("number outside field")
        self.num = num
        self.prime = prime

    def __repr__(self):
        return f"F_{self.prime}({self.num})"

    def __eq__(self, other):
        return other is not None and self.num == other.num and self.prime == other.prime

    def __add__(self, other):
        return self.__class__((self.num + other.num) % self.prime, self.prime)

    def __sub__(self, other):
        return self.__class__((self.num - other.num) % self.prime, self.prime)

    def __mul__(self, other):
        return self.__class__((self.num * other.num) % self.prime, self.prime)

    def __pow__(self, exponent):
        return self.__class__(pow(self.num, exponent % (self.prime - 1), self.prime), self.prime)

    def __truediv__(self, other):
        return self * other ** (self.prime - 2)


prime = 223
x1, y1 = FieldElement(170, prime), FieldElement(142, prime)
x2, y2 = FieldElement(60, prime), FieldElement(139, prime)
s = (y2 - y1) / (x2 - x1)
x3 = s**2 - x1 - x2
y3 = s * (x1 - x3) - y1
print(x3, y3)
```
