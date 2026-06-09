<!-- order: 9 -->

## Cierre

Una transacción Bitcoin es un contenedor serializado que conecta UTXOs del pasado con condiciones de gasto futuras.

Lo esencial:

- **Entradas** referencian UTXOs previos y aportan prueba de gasto (`script_sig`).
- **Salidas** fijan cantidades y condiciones de bloqueo (`script_pubkey`).
- **Locktime** y **sequence** añaden restricciones temporales.
- La **comisión** es implícita: entradas menos salidas.

En **Script** aprenderás el lenguaje de pila que hace cumplir esas condiciones de bloqueo y desbloqueo.
