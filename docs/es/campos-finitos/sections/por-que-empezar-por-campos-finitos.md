<!-- order: 2 -->

## ¿Por qué empezar por Campos Finitos?

Bitcoin utiliza la **criptografía de curva elíptica** (ECDSA) para la creación de firmas digitales y llaves públicas. Estas firmas prueban que el emisor de una transacción posee la llave privada que le permite gastar sus fondos, sin necesidad de revelar esa llave al resto de la red.

Para que las computadoras puedan procesar y verificar estas curvas de forma exacta, segura y determinista, no podemos usar la geometría escolar de números reales continuos. Las computadoras sufren de errores de redondeo al manejar decimales pequeños y números infinitos, lo cual rompería el consenso global en Bitcoin.

Necesitamos un sistema donde las operaciones sean:
1.  **Discretas:** Sin decimales ni aproximaciones.
2.  **Deterministas:** El resultado debe ser idéntico en cualquier computadora del mundo.
3.  **Exactas:** Sin pérdida de precisión.

Un **campo finito** nos proporciona precisamente esto. Provee un conjunto limitado de números enteros y define reglas especiales que garantizan que cualquier cálculo (incluso la división) resulte en otro número entero dentro del mismo conjunto.

---
