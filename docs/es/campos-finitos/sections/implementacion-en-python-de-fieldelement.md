<!-- order: 10 -->

## Implementación en Python de `FieldElement`

A continuación, implementaremos la clase `FieldElement` que representa un elemento individual de un campo finito de orden primo.

### 1. Inicialización y Validación
El constructor de la clase recibe el valor `num` y el orden primo `prime`. Se asegura de que el número esté dentro del rango válido del campo ($0 \le num < prime$).

```python
class FieldElement:
    def __init__(self, num, prime):
        if num >= prime or num < 0:
            error = "El número {} no pertenece al campo de orden 0 a {}".format(num, prime - 1)
            raise ValueError(error)
        self.num = num
        self.prime = prime

    def __repr__(self):
        return f"FieldElement_{self.prime}({self.num})"
```

### 2. Comparaciones (Igualdad y Diferencia)
Para comparar dos elementos, debemos asegurarnos de que tengan el mismo valor numérico y que pertenezcan al mismo campo.

```python
    def __eq__(self, other):
        if other is None:
            return False
        return self.num == other.num and self.prime == other.prime

    def __ne__(self, other):
        return not (self == other)
```

### 3. Operaciones Aritméticas Básicas
Antes de realizar cualquier operación matemática, validamos que ambos operandos pertenezcan al mismo campo finito (`self.prime == other.prime`).

```python
    def __add__(self, other):
        if self.prime != other.prime:
            raise TypeError("No se pueden sumar elementos de campos distintos")
        num = (self.num + other.num) % self.prime
        return self.__class__(num, self.prime)

    def __sub__(self, other):
        if self.prime != other.prime:
            raise TypeError("No se pueden restar elementos de campos distintos")
        num = (self.num - other.num) % self.prime
        return self.__class__(num, self.prime)

    def __mul__(self, other):
        if self.prime != other.prime:
            raise TypeError("No se pueden multiplicar elementos de campos distintos")
        num = (self.num * other.num) % self.prime
        return self.__class__(num, self.prime)
```

### 4. Exponenciación y División
Utilizamos el exponente de tipo entero y aplicamos el módulo $p-1$ al exponente para poder admitir de forma nativa exponentes negativos y de gran tamaño. Para la división, multiplicamos por el inverso de Fermat.

```python
    def __pow__(self, exponent):
        n = exponent % (self.prime - 1)
        num = pow(self.num, n, self.prime)
        return self.__class__(num, self.prime)

    def __truediv__(self, other):
        if self.prime != other.prime:
            raise TypeError("No se pueden dividir elementos de campos distintos")
        # Usamos el Teorema de Fermat: num * (other.num ** (prime - 2)) mod prime
        num = self.num * pow(other.num, self.prime - 2, self.prime)
        num %= self.prime
        return self.__class__(num, self.prime)
```

---

### Clase completa del capítulo 1

El libro construye esta clase por etapas: validación, igualdad, suma, resta, multiplicación, exponenciación y división. Aquí tienes la versión completa en un solo lugar para ejecutar todo el modelo de objetos.

```python-sandbox
class FieldElement:
    def __init__(self, num, prime):
        if num < 0 or num >= prime:
            raise ValueError(f"{num} no está en el rango 0 a {prime - 1}")
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
            raise TypeError("No se puede operar con dos campos distintos")

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

### Cobertura de práctica

Usa esta lista para confirmar que puedes reproducir todas las operaciones del capítulo 1:

- Reducir enteros positivos y negativos dentro de $F_p$ con aritmética modular.
- Explicar por qué $F_p$ debe tener orden primo para que todo elemento distinto de cero tenga inverso.
- Calcular suma, resta, multiplicación, potencias y división a mano en un campo pequeño como $F_{19}$.
- Usar el pequeño teorema de Fermat para reemplazar la división por multiplicación con $b^{p-2}$.
- Confirmar que exponentes grandes y negativos pueden reducirse módulo $p-1$.
- Extender `FieldElement` solo con operaciones que preserven el mismo primo del campo.
