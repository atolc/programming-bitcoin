# Capitulo 1: Campos finitos

## Mapa del capitulo

Este capitulo construye una pieza matematica que Bitcoin necesita antes de hablar de llaves, firmas y curvas elipticas: los campos finitos.

La idea central es sencilla: en vez de trabajar con todos los numeros posibles, trabajamos con un conjunto limitado y definimos operaciones que siempre regresan al mismo conjunto.

Al terminar deberias poder:

- Explicar que es un campo finito `Fp`.
- Usar modulo para mantener resultados entre `0` y `p - 1`.
- Sumar, restar, multiplicar, elevar y dividir dentro de un campo finito.
- Entender por que el modulo debe ser primo en los campos que usaremos.
- Implementar una clase `FieldElement` en Python.
- Ver por que esto es necesario para criptografia de curva eliptica.

## Por que empezar por campos finitos

Bitcoin usa criptografia de curva eliptica para crear y verificar firmas digitales. Esas firmas son las que prueban que quien gasta una moneda conoce la llave privada correcta, sin revelar esa llave.

Antes de llegar a las curvas elipticas necesitamos una aritmetica especial. No basta con los numeros reales que graficamos en el colegio, porque Bitcoin necesita operaciones discretas, exactas y verificables por cualquier nodo.

Un campo finito nos da justo eso:

- Un conjunto limitado de elementos.
- Reglas cerradas para operar.
- Resultados deterministas.
- Una forma de hacer division sin decimales.
- Una base para construir puntos de curvas elipticas en capitulos posteriores.

Piensa en este capitulo como aprender el sistema de coordenadas donde despues viviran las llaves publicas.

## Definicion de campo finito

Un campo finito es un conjunto finito de elementos con dos operaciones principales: suma y multiplicacion.

Para que un conjunto sea un campo, debe cumplir estas reglas:

- **Cerradura:** si `a` y `b` estan en el campo, entonces `a + b` y `a * b` tambien estan en el campo.
- **Identidad aditiva:** existe `0`, y `a + 0 = a`.
- **Identidad multiplicativa:** existe `1`, y `a * 1 = a`.
- **Inverso aditivo:** para cada `a`, existe `-a`, de forma que `a + (-a) = 0`.
- **Inverso multiplicativo:** para cada `a != 0`, existe `a^-1`, de forma que `a * a^-1 = 1`.

La parte mas importante para programar es la cerradura. Si el campo tiene solo ciertos elementos, ninguna operacion valida puede escapar de ahi.

Ejemplo: el conjunto `{0, 1, 2}` no esta cerrado bajo suma normal, porque `1 + 2 = 3` y `3` no pertenece al conjunto. Para convertir conjuntos finitos en algo util, necesitamos redefinir las operaciones.

## Conjuntos finitos y notacion

Si el campo tiene orden `p`, sus elementos son:

```text
Fp = {0, 1, 2, ..., p - 1}
```

El orden es el tamano del campo. Por ejemplo:

```text
F11 = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
F17 = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16}
F983 = {0, 1, 2, ..., 982}
```

Observa que el elemento mas grande siempre es `p - 1`.

Cuando decimos que `7` esta en `F11`, no lo tratamos simplemente como el entero `7`, sino como un elemento del campo de orden `11`. Ese detalle importa: `7` en `F11` y `7` en `F13` no pertenecen al mismo campo, asi que no deberiamos sumarlos directamente en codigo.

## Aritmetica modular

La herramienta que mantiene los resultados dentro del campo es el modulo.

`a % p` significa: divide `a` entre `p` y quedate con el residuo. Ese residuo siempre queda entre `0` y `p - 1`.

Ejemplos:

```text
7 % 3 = 1
1747 % 241 = 60
-27 % 13 = 12
```

La forma intuitiva de verlo es como un reloj. Si son las 3 y pasan 47 horas:

```text
(3 + 47) % 12 = 2
```

Tambien funciona hacia atras. Si son las 3 y retrocedes 16 horas:

```text
(3 - 16) % 12 = 11
```

Ese "envolver" los resultados es exactamente lo que necesitamos: aunque una operacion produzca un numero grande o negativo, el modulo lo regresa al rango valido del campo.

En Python:

```python
print(7 % 3)      # 1
print(-27 % 13)  # 12
```

## Suma y resta en fp

En un campo `Fp`, la suma no se queda como suma normal. Sumamos y luego aplicamos modulo `p`.

```text
a +f b = (a + b) % p
```

En `F19`:

```text
7 +f 8 = (7 + 8) % 19 = 15
11 +f 17 = (11 + 17) % 19 = 9
```

El segundo resultado se siente raro al principio, porque `11 + 17` normalmente es `28`. Pero en `F19`, `28` se envuelve y cae en `9`.

La resta funciona igual:

```text
a -f b = (a - b) % p
```

En `F19`:

```text
11 -f 9 = (11 - 9) % 19 = 2
6 -f 13 = (6 - 13) % 19 = 12
```

El inverso aditivo tambien sale del modulo:

```text
-f 9 = (-9) % 19 = 10
9 +f 10 = 0
```

Si quieres practicar, resuelve estas operaciones en `F57`:

```text
44 + 33
9 - 29
17 + 42 + 49
52 - 30 - 38
```

Pista: haz la operacion normal y aplica `% 57` al final.

## Multiplicacion y exponentiacion

La multiplicacion tambien debe quedar cerrada. En `Fp`:

```text
a *f b = (a * b) % p
```

En `F19`:

```text
5 *f 3 = (5 * 3) % 19 = 15
8 *f 17 = (8 * 17) % 19 = 3
```

`8 * 17 = 136`, pero `136 % 19 = 3`. El resultado vuelve al conjunto `{0, 1, ..., 18}`.

La exponentiacion es multiplicacion repetida:

```text
a^n = a * a * a ... n veces
```

En un campo finito tambien reducimos con modulo:

```text
7^3 en F19 = 343 % 19 = 1
```

En Python conviene usar `pow(base, exponente, modulo)` porque calcula el modulo durante la exponentiacion y evita numeros gigantes:

```python
pow(7, 3, 19)  # 1
```

## Por que el orden debe ser primo

Los campos que usaremos tienen orden primo: `F7`, `F19`, `F31`, `F223`, etc.

La razon practica es que, si `p` es primo, cada elemento distinto de cero tiene inverso multiplicativo. Eso es lo que hace posible la division dentro del campo.

Mira esta idea en `F19`. Si tomas cualquier `k` distinto de cero y multiplicas todo el conjunto por `k`, aplicando modulo `19`, obtienes los mismos elementos en otro orden:

```text
{k * 0, k * 1, k * 2, ..., k * 18} mod 19
```

No se pierden elementos. En cambio, si el orden fuera compuesto, un divisor del orden podria colapsar el conjunto en un subconjunto mas pequeno. Por ejemplo, modulo `12`, multiplicar por `3` produce:

```text
0, 3, 6, 9, 0, 3, 6, 9, ...
```

No aparecen todos los elementos. Eso rompe la simetria que necesitamos para que todos los elementos no cero tengan inverso.

## Division y pequeno teorema de fermat

La division es la operacion menos intuitiva del capitulo.

En aritmetica normal, dividir es deshacer una multiplicacion:

```text
7 * 8 = 56  implica  56 / 8 = 7
```

En un campo finito hacemos lo mismo. Si en `F19`:

```text
3 *f 7 = 21 % 19 = 2
```

entonces:

```text
2 /f 7 = 3
```

La pregunta es: como encontramos ese `3` sin adivinar?

Usamos el pequeno teorema de Fermat:

```text
n^(p - 1) % p = 1
```

si `p` es primo y `n != 0`.

Eso nos permite calcular el inverso multiplicativo:

```text
b^-1 = b^(p - 2)
```

Entonces la division se vuelve multiplicacion:

```text
a /f b = a *f b^(p - 2)
```

En `F19`:

```text
2 /f 7 = 2 * 7^(19 - 2) % 19 = 3
7 /f 5 = 7 * 5^(19 - 2) % 19 = 9
```

En Python:

```python
num = self.num * pow(other.num, self.prime - 2, self.prime)
num %= self.prime
```

No se puede dividir por `0`, igual que en aritmetica normal.

## Exponentes negativos

Los exponentes negativos tambien se interpretan mediante inversos.

Por ejemplo:

```text
a^-3 = 1 / a^3
```

Dentro de `Fp`, Fermat nos da una forma elegante de convertir exponentes negativos a positivos. Como:

```text
a^(p - 1) = 1
```

podemos sumar o restar multiplos de `p - 1` al exponente sin cambiar el resultado.

La forma practica en codigo es:

```python
n = exponent % (self.prime - 1)
num = pow(self.num, n, self.prime)
```

Esto sirve para exponentes negativos y tambien para exponentes enormes.

Ejemplo: en `F13`, `7^-3` da `8`.

```python
pow(7, -3 % (13 - 1), 13)  # 8
```

## Implementacion de fieldelement

La clase `FieldElement` representa un elemento de un campo `Fprime`.

Primero validamos que `num` este en el rango correcto:

```python
class FieldElement:
    def __init__(self, num, prime):
        if num >= prime or num < 0:
            error = "Num {} not in field range 0 to {}".format(num, prime - 1)
            raise ValueError(error)
        self.num = num
        self.prime = prime
```

La igualdad debe comparar tanto el numero como el campo:

```python
def __eq__(self, other):
    if other is None:
        return False
    return self.num == other.num and self.prime == other.prime

def __ne__(self, other):
    return not (self == other)
```

Para sumar, restar y multiplicar, primero comprobamos que ambos elementos pertenecen al mismo campo:

```python
def __add__(self, other):
    if self.prime != other.prime:
        raise TypeError("Cannot add two numbers in different Fields")
    num = (self.num + other.num) % self.prime
    return self.__class__(num, self.prime)

def __sub__(self, other):
    if self.prime != other.prime:
        raise TypeError("Cannot subtract two numbers in different Fields")
    num = (self.num - other.num) % self.prime
    return self.__class__(num, self.prime)

def __mul__(self, other):
    if self.prime != other.prime:
        raise TypeError("Cannot multiply two numbers in different Fields")
    num = (self.num * other.num) % self.prime
    return self.__class__(num, self.prime)
```

La potencia usa un exponente entero, no otro `FieldElement`:

```python
def __pow__(self, exponent):
    n = exponent % (self.prime - 1)
    num = pow(self.num, n, self.prime)
    return self.__class__(num, self.prime)
```

La division usa el inverso multiplicativo:

```python
def __truediv__(self, other):
    if self.prime != other.prime:
        raise TypeError("Cannot divide two numbers in different Fields")
    num = self.num * pow(other.num, self.prime - 2, self.prime)
    num %= self.prime
    return self.__class__(num, self.prime)
```

`self.__class__` permite que esta logica sea heredable si luego creamos clases especializadas para Bitcoin.

## Practica guiada

Haz estos ejercicios antes de pasar al siguiente capitulo.

1. En `F57`, calcula:

```text
44 + 33
9 - 29
17 + 42 + 49
52 - 30 - 38
```

2. En `F97`, calcula:

```text
95 * 45 * 31
17 * 13 * 19 * 44
12^7 * 77^49
```

3. En `F31`, calcula:

```text
3 / 24
17^-3
4^-4 * 11
```

4. Implementa `FieldElement` y verifica:

```python
a = FieldElement(7, 13)
b = FieldElement(12, 13)
c = FieldElement(6, 13)

print(a + b == c)  # True
print(a ** -3 == FieldElement(8, 13))  # True
```

La meta no es memorizar resultados. La meta es que cada operacion te recuerde este flujo:

```text
operar como entero -> aplicar modulo -> regresar un FieldElement
```

## Cierre

Los campos finitos convierten la aritmetica en un sistema cerrado y programable. Esa cerradura es lo que permite que Bitcoin use numeros enormes sin perder exactitud ni depender de aproximaciones.

En el capitulo 2 aprenderas curvas elipticas. En el capitulo 3 combinaremos ambas ideas: puntos de curvas elipticas cuyas coordenadas viven dentro de campos finitos.
