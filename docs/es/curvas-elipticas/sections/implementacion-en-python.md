<!-- order: 7 -->

## Implementación en Python

Unimos validación, suma, duplicación y el punto al infinito en una clase `Point` reutilizable:

```python
class Point:
    def __init__(self, x, y, a, b):
        self.a = a
        self.b = b
        self.x = x
        self.y = y
        if x is not None:
            if y**2 != x**3 + a*x + b:
                raise ValueError(f"({x}, {y}) no esta en la curva")

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y and self.a == other.a and self.b == other.b

    def __ne__(self, other):
        return not (self == other)

    def __repr__(self):
        if self.x is None:
            return "Point(infinito)"
        return f"Point({self.x}, {self.y})"

    def __add__(self, other):
        if self.a != other.a or self.b != other.b:
            raise TypeError("Puntos de curvas distintas")
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
> En el siguiente capítulo reemplazaremos la división real por aritmética modular en $F_p$.

### Ejecutar las comprobaciones del capítulo 2

La clase de puntos debe rechazar puntos inválidos, rechazar puntos de curvas distintas, manejar el punto al infinito, sumar puntos distintos, duplicar un punto y devolver infinito para líneas verticales.

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
            raise ValueError(f"({self.x}, {self.y}) no está en la curva")

    def __repr__(self):
        if self.x is None:
            return "Point(infinito)"
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
            raise TypeError("Los puntos no están en la misma curva")
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
        raise RuntimeError("caso de suma de puntos no manejado")


p1 = Point(-1, -1, 5, 7)
p2 = Point(-1, 1, 5, 7)
inf = Point(None, None, 5, 7)
print("p1 + inverso =", p1 + p2)
print("infinito + p1 =", inf + p1)
print("p1 + p1 =", p1 + p1)
```
