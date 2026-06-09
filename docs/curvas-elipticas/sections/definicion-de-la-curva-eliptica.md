<!-- order: 2 -->

## Definición de la curva elíptica

Una curva elíptica sobre los reales tiene la forma:

$$y^2 = x^3 + ax + b$$

Donde $4a^3 + 27b^2 \neq 0$ (condición de no singularidad).

Comparada con una cúbica clásica $y = ax^3 + bx^2 + cx + d$, el término $y^2$ a la izquierda hace que la gráfica sea **simétrica respecto al eje $x$**: si $(x, y)$ está en la curva, también lo está $(x, -y)$.

En criptografía no usamos la curva continua de la figura del libro, sino una versión definida sobre un **campo finito**. Pero la intuición geométrica de sumar puntos nace de la curva real.

> [!TIP]
> Piensa en la curva elíptica como un conjunto de puntos $(x, y)$ que satisfacen la ecuación, más un punto especial llamado **punto al infinito** ($\mathcal{O}$).
