# Capítulo 1: Campos Finitos

## Mapa del Capítulo

Este capítulo construye una pieza matemática fundamental que Bitcoin necesita antes de hablar de llaves, firmas y curvas elípticas: los **campos finitos**.

La idea central es sencilla: en lugar de trabajar con todos los números reales posibles (que son infinitos y sufren de imprecisiones de coma flotante), trabajamos con un conjunto limitado de elementos y definimos operaciones matemáticas especiales que garantizan que el resultado siempre permanezca dentro de ese mismo conjunto.

Al terminar este capítulo, serás capaz de:
*   Explicar qué es un campo finito $F_p$.
*   Utilizar la aritmética modular para mantener los resultados entre $0$ y $p-1$.
*   Sumar, restar, multiplicar, elevar a potencias y dividir dentro de un campo finito.
*   Entender y demostrar por qué el orden del campo debe ser un número primo en criptografía.
*   Implementar la clase completa `FieldElement` en Python.
*   Ver cómo esta estructura es la base para la criptografía de curva elíptica.

---

## Sección 1: ¿Por qué empezar por Campos Finitos?

Bitcoin utiliza la **criptografía de curva elíptica** (ECDSA) para la creación de firmas digitales y llaves públicas. Estas firmas prueban que el emisor de una transacción posee la llave privada que le permite gastar sus fondos, sin necesidad de revelar esa llave al resto de la red.

Para que las computadoras puedan procesar y verificar estas curvas de forma exacta, segura y determinista, no podemos usar la geometría escolar de números reales continuos. Las computadoras sufren de errores de redondeo al manejar decimales pequeños y números infinitos, lo cual rompería el consenso global en Bitcoin.

Necesitamos un sistema donde las operaciones sean:
1.  **Discretas:** Sin decimales ni aproximaciones.
2.  **Deterministas:** El resultado debe ser idéntico en cualquier computadora del mundo.
3.  **Exactas:** Sin pérdida de precisión.

Un **campo finito** nos proporciona precisamente esto. Provee un conjunto limitado de números enteros y define reglas especiales que garantizan que cualquier cálculo (incluso la división) resulte en otro número entero dentro del mismo conjunto.

---

## Sección 2: Definición y Propiedades de un Campo Finito

Matemáticamente, un **campo finito** es un conjunto finito de elementos junto con dos operaciones llamadas *suma* ($+$) y *multiplicación* ($*$).

Para que este conjunto se considere un campo, debe cumplir rigurosamente con las siguientes propiedades:

*   **Cerradura:** Si $a$ y $b$ pertenecen al campo, entonces $a + b$ y $a * b$ también pertenecen al campo. Esto significa que las operaciones no pueden "escapar" del conjunto.
*   **Identidad Aditiva:** Existe un elemento $0$ en el campo tal que $a + 0 = a$.
*   **Identidad Multiplicativa:** Existe un elemento $1$ en el campo tal que $a * 1 = a$.
*   **Inverso Aditivo:** Para cada elemento $a$ en el campo, existe otro elemento $-a$ tal que $a + (-a) = 0$.
*   **Inverso Multiplicativo:** Para cada elemento $a \neq 0$ en el campo, existe otro elemento $a^{-1}$ tal que $a * a^{-1} = 1$.

### ¿Por qué necesitamos cambiar las reglas matemáticas?
Imaginemos el conjunto simple $\{0, 1, 2\}$. Si usamos la suma tradicional de enteros:
$$1 + 2 = 3$$
Dado que $3$ no está en nuestro conjunto, el sistema no está cerrado y por lo tanto **no es un campo**. Para solucionarlo y mantener los resultados dentro de nuestro rango cerrado, recurrimos al módulo.

---

## Sección 3: Aritmética Modular (La Envoltura)

La herramienta principal para lograr la cerradura matemática es la **aritmética modular** (módulo).

La expresión $a \pmod p$ se lee como "$a$ módulo $p$" y representa el **residuo** o resto al dividir $a$ entre $p$. Este residuo siempre será un número entero mayor o igual a $0$ y estrictamente menor que $p$ ($0 \le \text{residuo} < p$).

Matemáticamente, $a \pmod p = r$ significa que existe un cociente entero $q$ tal que:
$$a = q \cdot p + r$$

### Ejemplos paso a paso:

1.  **Módulo positivo:** $7 \pmod 3 = 1$
    *   *Explicación:* $7 = 2 \cdot 3 + 1$. El cociente es $2$ y el resto es $1$.
2.  **Módulo con números más grandes:** $1747 \pmod{241} = 60$
    *   *Explicación:* $1747 = 7 \cdot 241 + 60$. El cociente es $7$ y el resto es $60$.
3.  **Módulo negativo:** $-27 \pmod{13} = 12$
    *   *Explicación:* Queremos que el residuo sea positivo. Dividimos hacia abajo: $-27 = (-3) \cdot 13 + 12$. El cociente es $-3$ y el resto es $12$.

### La analogía del reloj
Una forma intuitiva de comprender el módulo es pensar en las horas de un reloj de 12 horas.
*   Si son las 3 y le sumamos 47 horas, podemos calcular el resultado con módulo 12:
    $$(3 + 47) \pmod{12} = 50 \pmod{12} = 2 \text{ (las 2 en punto)}$$
*   De igual manera hacia atrás: si son las 3 y retrocedemos 16 horas:
    $$(3 - 16) \pmod{12} = -13 \pmod{12} = 11 \text{ (las 11 en punto)}$$

Probemos este concepto ejecutando el siguiente código interactivo en Python:

```python-sandbox
# Módulos en Python
print("Módulo simple (7 % 3):", 7 % 3)
print("Módulo grande (1747 % 241):", 1747 % 241)
print("Módulo negativo (-27 % 13):", -27 % 13)
---
Módulo simple (7 % 3): 1
Módulo grande (1747 % 241): 60
Módulo negativo (-27 % 13): 12
```

### Notación de Campos Finitos
Si el campo tiene orden $p$ (donde $p$ es un número primo), sus elementos son:
$$F_p = \{0, 1, 2, \dots, p - 1\}$$

Por ejemplo, los elementos del campo $F_{11}$ son:
$$F_{11} = \{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}$$

> [!IMPORTANT]  
> Un número entero como $7$ no existe flotando de manera independiente en el vacío; pertenece a un campo específico. Por ejemplo, $7 \in F_{11}$ no es igual y no se puede operar directamente con $7 \in F_{17}$. Pertenecen a campos con reglas y órdenes distintos.

---

## Sección 4: Suma y Resta en $F_p$

En un campo finito $F_p$, definimos la suma $+_f$ y la resta $-_f$ aplicando la operación normal en enteros y luego calculando el residuo módulo $p$.

$$\begin{aligned}
a +_f b &= (a + b) \pmod p \\
a -_f b &= (a - b) \pmod p
\end{aligned}$$

### Ejemplos detallados en $F_{19}$:

*   **Suma normal:** $7 +_f 8$
    $$7 + 8 = 15 \implies 15 \pmod{19} = 15$$
*   **Suma que envuelve (Wrap-around):** $11 +_f 17$
    $$11 + 17 = 28 \implies 28 \pmod{19} = 9 \quad (\text{ya que } 28 = 1 \cdot 19 + 9)$$
*   **Resta simple:** $11 -_f 9$
    $$11 - 9 = 2 \implies 2 \pmod{19} = 2$$
*   **Resta con resultado negativo:** $6 -_f 13$
    $$6 - 13 = -7 \implies -7 \pmod{19} = 12 \quad (\text{ya que } -7 = (-1) \cdot 19 + 12)$$

Veamos el comportamiento de estas sumas y restas en Python:

```python-sandbox
p = 19
# Suma que envuelve
suma = (11 + 17) % p
print(f"11 + 17 mod 19 = {suma}")

# Resta con resultado negativo
resta = (6 - 13) % p
print(f"6 - 13 mod 19 = {resta}")
---
11 + 17 mod 19 = 9
6 - 13 mod 19 = 12
```

---

## Sección 5: Multiplicación y Exponenciación

La multiplicación en un campo finito también requiere envolver el resultado mediante el módulo $p$:

$$a *_f b = (a \cdot b) \pmod p$$

### Ejemplos en $F_{19}$:
*   **Multiplicación básica:** $5 *_f 3$
    $$5 \cdot 3 = 15 \implies 15 \pmod{19} = 15$$
*   **Multiplicación con envoltura:** $8 *_f 17$
    $$8 \cdot 17 = 136$$
    $$136 \pmod{19} = 3 \quad (\text{ya que } 136 = 7 \cdot 19 + 3)$$

### Exponenciación
La exponenciación es la multiplicación repetida de un elemento por sí mismo:
$$a^n = \underbrace{a \cdot a \cdot \dots \cdot a}_{n \text{ veces}}$$

En $F_{19}$, calculemos $7^3$:
$$7^3 = 343 \implies 343 \pmod{19} = 1 \quad (\text{ya que } 343 = 18 \cdot 19 + 1)$$

> [!TIP]  
> Al programar exponenciaciones modulares en Python, **nunca** eleves primero y apliques módulo después (ej: `(7 ** 3) % 19`), porque si los números son muy grandes (como en Bitcoin, donde los números tienen 256 bits), la memoria colapsará. Usa la función integrada `pow(base, exponente, modulo)`, la cual calcula el residuo en cada paso intermedio del algoritmo de exponenciación binaria.

Ejecutemos este concepto para verificar:

```python-sandbox
# Uso correcto de pow para exponenciación modular
base = 7
exponente = 3
primo = 19

resultado = pow(base, exponente, primo)
print(f"7^3 mod 19 = {resultado}")
---
7^3 mod 19 = 1
```

---

## Sección 6: ¿Por qué el Orden debe ser un Número Primo?

La razón por la cual los campos finitos que usa Bitcoin (como el campo de la curva `secp256k1`) tienen un orden primo $p$ es de suma importancia. **Si el orden del campo es primo, todos los elementos excepto el cero tienen un inverso multiplicativo.** Esto es lo que permite que la división sea posible y única.

Si tomamos un elemento no nulo $k$ de nuestro campo $F_p$ (con $p$ primo) y multiplicamos cada uno de los elementos del campo por $k$:
$$\{k \cdot 0, k \cdot 1, k \cdot 2, \dots, k \cdot (p-1)\} \pmod p$$
El resultado de este conjunto será exactamente el conjunto original $\{0, 1, 2, \dots, p-1\}$ reordenado. No se pierde ningún elemento.

### ¿Qué pasa si el orden del campo es compuesto?
Tomemos el módulo 12 (compuesto). Si multiplicamos todos los números por 3, obtenemos:
$$\begin{aligned}
3 \cdot 0 \pmod{12} &= 0 \\
3 \cdot 1 \pmod{12} &= 3 \\
3 \cdot 2 \pmod{12} &= 6 \\
3 \cdot 3 \pmod{12} &= 9 \\
3 \cdot 4 \pmod{12} &= 0 \quad (\text{¡Se repite el 0 y colapsa!})
\end{aligned}$$
El conjunto resultante bajo multiplicación por 3 es $\{0, 3, 6, 9\}$, lo cual es un subconjunto incompleto. Esto rompe la simetría matemática y hace imposible definir un inverso multiplicativo único para el 3.

---

## Sección 7: División y el Pequeño Teorema de Fermat

La división en campos finitos es la operación que más confunde a los estudiantes.

En la aritmética de números enteros tradicionales, no podemos dividir de manera exacta (por ejemplo, $2 / 7$ no produce un entero). Sin embargo, en un campo finito la división debe resultar en un elemento del campo.

Para resolver esto, recordamos la definición de división: **dividir es multiplicar por el inverso multiplicativo.**
$$\frac{a}{b} = a \cdot b^{-1}$$

¿Qué es $b^{-1}$? Es el elemento en el campo tal que:
$$b \cdot b^{-1} \equiv 1 \pmod p$$

Por ejemplo, en $F_{19}$, si queremos resolver $2 / 7$, buscamos un número $x$ tal que:
$$x \cdot 7 \equiv 2 \pmod{19}$$
Sabemos que $3 \cdot 7 = 21 \equiv 2 \pmod{19}$. Por lo tanto, $\frac{2}{7} = 3$.

### ¿Cómo calculamos $b^{-1}$ sin adivinar?
Utilizamos el **Pequeño Teorema de Fermat**. Este teorema establece que para cualquier primo $p$ y cualquier entero $b \neq 0$:
$$b^{p-1} \equiv 1 \pmod p$$

Si multiplicamos ambos lados por $b^{-1}$:
$$b^{p-2} \equiv b^{-1} \pmod p$$

¡Esta fórmula es mágica! Nos dice que el inverso multiplicativo de $b$ es simplemente $b$ elevado a la potencia $p-2$ en aritmética modular.
Por lo tanto, la división se calcula como:
$$\frac{a}{b} = a \cdot b^{p-2} \pmod p$$

### Ejemplo paso a paso en $F_{19}$:
Calculemos $2 / 7$:
$$2 / 7 = 2 \cdot 7^{19-2} \pmod{19} = 2 \cdot 7^{17} \pmod{19}$$
Usando Fermat y reduciendo potencias:
$$2 \cdot 7^{17} \pmod{19} = 3$$

Ejecutemos la prueba en Python utilizando `pow`:

```python-sandbox
# División en campos finitos mediante el teorema de Fermat
a = 2
b = 7
p = 19

# Calculamos el inverso de 7 mod 19, que es 7^(19-2) mod 19
inverso_b = pow(b, p - 2, p)
print(f"El inverso de 7 mod 19 es: {inverso_b}")

# Multiplicamos a por el inverso de b
resultado = (a * inverso_b) % p
print(f"Resultado de 2 / 7 mod 19 es: {resultado}")
---
El inverso de 7 mod 19 es: 11
Resultado de 2 / 7 mod 19 es: 3
```

---

## Sección 8: Exponentes Negativos y Grandes

¿Qué significa elevar un número a un exponente negativo en un campo finito? Por ejemplo, $a^{-3}$.

Al igual que en la matemática tradicional, el signo negativo denota el inverso:
$$a^{-3} = (a^3)^{-1} = (a^{-1})^3$$

Gracias al Pequeño Teorema de Fermat ($a^{p-1} \equiv 1 \pmod p$), podemos sumar o restar múltiplos de $p-1$ al exponente sin alterar el resultado final. Esto nos da una herramienta extremadamente útil en código:

$$a^n \equiv a^{n \pmod{p-1}} \pmod p$$

Esto no solo nos permite calcular exponentes negativos, sino también reducir exponentes de tamaño astronómico a un rango manejable.

### Ejemplo en $F_{13}$:
Calculemos $7^{-3}$:
$$\begin{aligned}
-3 \pmod{13 - 1} &= -3 \pmod{12} = 9 \\
7^{-3} \pmod{13} &= 7^9 \pmod{13} = 8
\end{aligned}$$

Ejecutemos en Python:

```python-sandbox
# Exponente negativo y reducción modular del exponente
base = 7
exponente = -3
p = 13

# Reducimos el exponente
exp_reducido = exponente % (p - 1)
print(f"Exponente -3 mod 12 = {exp_reducido}")

# Operamos con el exponente reducido
resultado = pow(base, exp_reducido, p)
print(f"7^-3 mod 13 = {resultado}")
---
Exponente -3 mod 12 = 9
7^-3 mod 13 = 8
```

---

## Sección 9: Implementación en Python de `FieldElement`

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

## Sección 10: Práctica Guiada Interactiva

Resuelve los siguientes ejercicios utilizando tus conocimientos teóricos antes de desplegar las respuestas.

### Ejercicio 1: Sumas y Restas en $F_{57}$
Resuelve las siguientes operaciones matemáticas:
1.  $44 +_f 33$
2.  $9 -_f 29$
3.  $17 +_f 42 +_f 49$
4.  $52 -_f 30 -_f 38$

<details>
<summary><b>Ver solución paso a paso del Ejercicio 1</b></summary>

Para resolver en $F_{57}$, realizamos la operación tradicional y al final aplicamos el módulo $\% 57$:

1.  **$44 + 33 = 77$**
    $$77 \pmod{57} = 20$$
2.  **$9 - 29 = -20$**
    $$-20 \pmod{57} = 37 \quad (\text{puesto que } -20 = -1 \cdot 57 + 37)$$
3.  **$17 + 42 + 49 = 108$**
    $$108 \pmod{57} = 51 \quad (\text{puesto que } 108 = 1 \cdot 57 + 51)$$
4.  **$52 - 30 - 38 = -16$**
    $$-16 \pmod{57} = 41 \quad (\text{puesto que } -16 = -1 \cdot 57 + 41)$$

Comprobemos esto con un Sandbox:

```python-sandbox
p = 57
print("1. 44 + 33 mod 57 =", (44 + 33) % p)
print("2. 9 - 29 mod 57 =", (9 - 29) % p)
print("3. 17 + 42 + 49 mod 57 =", (17 + 42 + 49) % p)
print("4. 52 - 30 - 38 mod 57 =", (52 - 30 - 38) % p)
---
1. 44 + 33 mod 57 = 20
2. 9 - 29 mod 57 = 37
3. 17 + 42 + 49 mod 57 = 51
4. 52 - 30 - 38 mod 57 = 41
```
</details>

---

### Ejercicio 2: Multiplicación y Exponenciación en $F_{97}$
Resuelve:
1.  $95 * 45 * 31$
2.  $17 * 13 * 19 * 44$
3.  $12^7 * 77^{49}$

<details>
<summary><b>Ver solución paso a paso del Ejercicio 2</b></summary>

1.  **$95 \cdot 45 \cdot 31 = 132525$**
    $$132525 \pmod{97} = 23$$
2.  **$17 \cdot 13 \cdot 19 \cdot 44 = 184756$**
    $$184756 \pmod{97} = 62$$
3.  **$12^7 \cdot 77^{49} \pmod{97}$**
    *   Podemos elevar cada término individual y luego multiplicarlos:
        $$\begin{aligned}
        12^7 \pmod{97} &= 77 \\
        77^{49} \pmod{97} &= 27 \\
        (77 \cdot 27) \pmod{97} &= 2079 \pmod{97} = 42
        \end{aligned}$$

Ejecutemos la validación:

```python-sandbox
p = 97
print("1. 95 * 45 * 31 mod 97 =", (95 * 45 * 31) % p)
print("2. 17 * 13 * 19 * 44 mod 97 =", (17 * 13 * 19 * 44) % p)

term1 = pow(12, 7, p)
term2 = pow(77, 49, p)
print("3. (12^7 * 77^49) mod 97 =", (term1 * term2) % p)
---
1. 95 * 45 * 31 mod 97 = 23
2. 17 * 13 * 19 * 44 mod 97 = 62
3. (12^7 * 77^49) mod 97 = 42
```
</details>

---

### Ejercicio 3: División y Exponentes Negativos en $F_{31}$
Resuelve:
1.  $3 / 24$
2.  $17^{-3}$
3.  $4^{-4} * 11$

<details>
<summary><b>Ver solución paso a paso del Ejercicio 3</b></summary>

1.  **$3 / 24 = 3 \cdot 24^{29} \pmod{31}$**
    $$24^{-1} \pmod{31} = 24^{29} \pmod{31} = 29$$
    $$3 \cdot 29 \pmod{31} = 87 \pmod{31} = 25$$
2.  **$17^{-3} \pmod{31}$**
    *   El exponente se reduce mod $30$:
        $$-3 \pmod{30} = 27$$
        $$17^{27} \pmod{31} = 15$$
3.  **$4^{-4} \cdot 11 \pmod{31}$**
    *   Reducimos $-4 \pmod{30} = 26$
        $$4^{26} \pmod{31} = 16$$
        $$16 \cdot 11 \pmod{31} = 176 \pmod{31} = 21$$

Verifiquemos en la consola:

```python-sandbox
p = 31
# 1. División
inv_24 = pow(24, p - 2, p)
print("1. 3 / 24 mod 31 =", (3 * inv_24) % p)

# 2. Exponente negativo
print("2. 17^-3 mod 31 =", pow(17, -3 % (p - 1), p))

# 3. Exponente negativo con multiplicación
inv_pot_4 = pow(4, -4 % (p - 1), p)
print("3. 4^-4 * 11 mod 31 =", (inv_pot_4 * 11) % p)
---
1. 3 / 24 mod 31 = 25
2. 17^-3 mod 31 = 15
3. 4^-4 * 11 mod 31 = 21
```
</details>

---

## Cierre

Los campos finitos transforman operaciones matemáticas en sistemas numéricos cerrados, discretos y deterministas. Esta envoltura perfecta es la que permite que Bitcoin use criptografía extremadamente compleja con números de 256 bits sin errores de precisión ni incompatibilidades entre sistemas operativos.

En el **Capítulo 2**, estudiaremos las Curvas Elípticas. En el **Capítulo 3**, uniremos ambas piezas para dar vida a la Criptografía de Curva Elíptica: curvas definidas sobre coordenadas que viven dentro de un campo finito $F_p$.

:::details
Tabla rápida de operaciones en F_p

| Operación | Definición |
|-----------|------------|
| Suma | $(a + b) \bmod p$ |
| Resta | $(a - b) \bmod p$ |
| Multiplicación | $(a \cdot b) \bmod p$ |
| División | $a \cdot b^{p-2} \bmod p$ |
| Potencia | $a^k \bmod p$ |
| Inverso | $a^{p-2} \bmod p$ |
:::

```quiz
[
  {
    "prompt": "En F19, ¿cuál es el resultado de 11 + 17?",
    "options": ["28", "9", "17", "0"],
    "answer": 1,
    "explanation": "Primero sumas como enteros y luego aplicas modulo: 28 % 19 = 9."
  },
  {
    "prompt": "¿Por qué se usa un modulo primo para estos campos?",
    "options": [
      "Porque garantiza inversos multiplicativos para todo elemento no cero.",
      "Porque hace que todas las operaciones sean mas rapidas que la suma normal.",
      "Porque evita que existan elementos negativos.",
      "Porque Bitcoin solo acepta numeros menores que 19."
    ],
    "answer": 0,
    "explanation": "En un campo de orden primo, cada elemento distinto de cero tiene inverso multiplicativo."
  },
  {
    "prompt": "¿Qué significa dividir a / b dentro de un campo finito?",
    "options": [
      "Calcular un decimal y redondearlo.",
      "Restar b repetidas veces hasta llegar a a.",
      "Multiplicar a por el inverso multiplicativo de b.",
      "Usar division entera de Python."
    ],
    "answer": 2,
    "explanation": "La division se define como a * b^(-1), siempre que b no sea cero."
  },
  {
    "prompt": "Según el pequeño teorema de Fermat, si p es primo y n no es cero, ¿qué vale n^(p-1) % p?",
    "options": ["0", "1", "p - 1", "n"],
    "answer": 1,
    "explanation": "Ese resultado permite calcular inversos con n^(p-2) dentro de Fp."
  },
  {
    "prompt": "En la clase FieldElement, ¿qué se debe validar antes de sumar dos elementos?",
    "options": [
      "Que tengan el mismo prime.",
      "Que ambos numeros sean pares.",
      "Que el resultado no use modulo.",
      "Que el exponente sea positivo."
    ],
    "answer": 0,
    "explanation": "Sumar elementos de campos distintos no tiene significado dentro de esta abstraccion."
  }
]
```
