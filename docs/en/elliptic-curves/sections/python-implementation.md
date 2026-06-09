<!-- order: 7 -->

## Python Implementation

We combine validation, addition, doubling, and the point at infinity in a reusable `Point` class:

```python
class Point:
    def __init__(self, x, y, a, b):
        self.a = a
        self.b = b
        self.x = x
        self.y = y
        if x is not None:
            if y**2 != x**3 + a*x + b:
                raise ValueError(f"({x}, {y}) is not on the curve")

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y and self.a == other.a and self.b == other.b

    def __ne__(self, other):
        return not (self == other)

    def __repr__(self):
        if self.x is None:
            return "Point(infinity)"
        return f"Point({self.x}, {self.y})"

    def __add__(self, other):
        if self.a != other.a or self.b != other.b:
            raise TypeError("Points from different curves")
        if self.x is None:
            return other
        if other.x is None:
            return self
        if self.x == other.x and self.y != other.y:
            return self.__class__(None, None, self.a, self.b)
        if self != other:
            s = (other.y - self.y) / (other.x - self.x)
        else:
            s = (3 * self.x**2 + self.a) / (2 * self.y)
        x = s**2 - self.x - other.x
        y = s * (self.x - x) - self.y
        return self.__class__(x, y, self.a, self.b)
```

> [!TIP]
> In the next chapter we will replace real division with modular arithmetic in $F_p$.

### Run the Chapter 2 Checks

The point class should reject invalid points, reject points from different curves, handle the point at infinity, add distinct points, double a point, and return infinity for vertical lines.

```python-sandbox
class Point:
    def __init__(self, x, y, a, b):
        self.a = a
        self.b = b
        self.x = x
        self.y = y
        if self.x is None and self.y is None:
            return
        if self.y**2 != self.x**3 + a * self.x + b:
            raise ValueError(f"({self.x}, {self.y}) is not on the curve")

    def __repr__(self):
        if self.x is None:
            return "Point(infinity)"
        return f"Point({self.x}, {self.y})_{self.a}_{self.b}"

    def __eq__(self, other):
        return (
            self.x == other.x
            and self.y == other.y
            and self.a == other.a
            and self.b == other.b
        )

    def __add__(self, other):
        if self.a != other.a or self.b != other.b:
            raise TypeError("Points are not on the same curve")
        if self.x is None:
            return other
        if other.x is None:
            return self
        if self.x == other.x and self.y != other.y:
            return self.__class__(None, None, self.a, self.b)
        if self.x != other.x:
            s = (other.y - self.y) / (other.x - self.x)
            x = s**2 - self.x - other.x
            y = s * (self.x - x) - self.y
            return self.__class__(x, y, self.a, self.b)
        if self == other and self.y == 0:
            return self.__class__(None, None, self.a, self.b)
        if self == other:
            s = (3 * self.x**2 + self.a) / (2 * self.y)
            x = s**2 - 2 * self.x
            y = s * (self.x - x) - self.y
            return self.__class__(x, y, self.a, self.b)
        raise RuntimeError("unhandled point-addition case")


p1 = Point(-1, -1, 5, 7)
p2 = Point(-1, 1, 5, 7)
inf = Point(None, None, 5, 7)
print("p1 + inverse =", p1 + p2)
print("infinity + p1 =", inf + p1)
print("p1 + p1 =", p1 + p1)
```
