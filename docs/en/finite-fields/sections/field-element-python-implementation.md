<!-- order: 10 -->

## Python Implementation of `FieldElement`

Next, we will implement the `FieldElement` class that represents an individual element of a prime-order finite field.

### 1. Initialization and Validation
The class constructor receives the value `num` and the prime order `prime`. It ensures the number is within the valid range of the field ($0 \le num < prime$).

```python
class FieldElement:
    def __init__(self, num, prime):
        if num >= prime or num < 0:
            error = "Number {} is not in the field of order 0 to {}".format(num, prime - 1)
            raise ValueError(error)
        self.num = num
        self.prime = prime

    def __repr__(self):
        return f"FieldElement_{self.prime}({self.num})"
```

### 2. Comparisons (Equality and Inequality)
To compare two elements, we must ensure they have the same numeric value and belong to the same field.

```python
    def __eq__(self, other):
        if other is None:
            return False
        return self.num == other.num and self.prime == other.prime

    def __ne__(self, other):
        return not (self == other)
```

### 3. Basic Arithmetic Operations
Before performing any mathematical operation, we validate that both operands belong to the same finite field (`self.prime == other.prime`).

```python
    def __add__(self, other):
        if self.prime != other.prime:
            raise TypeError("Cannot add elements from different fields")
        num = (self.num + other.num) % self.prime
        return self.__class__(num, self.prime)

    def __sub__(self, other):
        if self.prime != other.prime:
            raise TypeError("Cannot subtract elements from different fields")
        num = (self.num - other.num) % self.prime
        return self.__class__(num, self.prime)

    def __mul__(self, other):
        if self.prime != other.prime:
            raise TypeError("Cannot multiply elements from different fields")
        num = (self.num * other.num) % self.prime
        return self.__class__(num, self.prime)
```

### 4. Exponentiation and Division
We use an integer exponent and apply modulus $p-1$ to the exponent to natively support negative and very large exponents. For division, we multiply by Fermat's inverse.

```python
    def __pow__(self, exponent):
        n = exponent % (self.prime - 1)
        num = pow(self.num, n, self.prime)
        return self.__class__(num, self.prime)

    def __truediv__(self, other):
        if self.prime != other.prime:
            raise TypeError("Cannot divide elements from different fields")
        # Use Fermat's theorem: num * (other.num ** (prime - 2)) mod prime
        num = self.num * pow(other.num, self.prime - 2, self.prime)
        num %= self.prime
        return self.__class__(num, self.prime)
```

---

### Complete Chapter 1 Class

The book builds this class incrementally: validation first, then equality, addition,
subtraction, multiplication, exponentiation, and finally division. Here is the
complete version in one place so you can run the whole object model at once.

```python-sandbox
class FieldElement:
    def __init__(self, num, prime):
        if num < 0 or num >= prime:
            raise ValueError(f"{num} is not in field range 0 to {prime - 1}")
        self.num = num
        self.prime = prime

    def __repr__(self):
        return f"FieldElement_{self.prime}({self.num})"

    def __eq__(self, other):
        if other is None:
            return False
        return self.num == other.num and self.prime == other.prime

    def __ne__(self, other):
        return not (self == other)

    def _check_field(self, other):
        if self.prime != other.prime:
            raise TypeError("Cannot operate on two different fields")

    def __add__(self, other):
        self._check_field(other)
        return self.__class__((self.num + other.num) % self.prime, self.prime)

    def __sub__(self, other):
        self._check_field(other)
        return self.__class__((self.num - other.num) % self.prime, self.prime)

    def __mul__(self, other):
        self._check_field(other)
        return self.__class__((self.num * other.num) % self.prime, self.prime)

    def __pow__(self, exponent):
        reduced = exponent % (self.prime - 1)
        return self.__class__(pow(self.num, reduced, self.prime), self.prime)

    def __truediv__(self, other):
        self._check_field(other)
        inverse = pow(other.num, self.prime - 2, self.prime)
        return self.__class__((self.num * inverse) % self.prime, self.prime)


a = FieldElement(7, 13)
b = FieldElement(12, 13)
print("a + b =", a + b)
print("a - b =", a - b)
print("a * b =", a * b)
print("a ** -3 =", a ** -3)
print("a / b =", a / b)
```

### Practice Coverage

Use this checklist to verify you can reproduce every operation from Chapter 1:

- Reduce positive and negative integers into $F_p$ with modulo arithmetic.
- Explain why $F_p$ must have prime order for every nonzero element to have an inverse.
- Compute addition, subtraction, multiplication, powers, and division by hand in a small field such as $F_{19}$.
- Use Fermat's little theorem to replace division by multiplication with $b^{p-2}$.
- Confirm that large and negative exponents can be reduced modulo $p-1$.
- Extend `FieldElement` only with operations that preserve the field prime.
