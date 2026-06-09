<!-- order: 9 -->

## Cierre

Una transacción Bitcoin es un contenedor serializado que conecta UTXOs del pasado con condiciones de gasto futuras.

Lo esencial:

- **Entradas** referencian UTXOs previos y aportan prueba de gasto (`script_sig`).
- **Salidas** fijan cantidades y condiciones de bloqueo (`script_pubkey`).
- **Locktime** y **sequence** añaden restricciones temporales.
- La **comisión** es implícita: entradas menos salidas.

En **Script** aprenderás el lenguaje de pila que hace cumplir esas condiciones de bloqueo y desbloqueo.

## Complemento de sección

En este punto debes poder leer una transacción heredada cruda como una secuencia de campos tipados y explicar dónde pertenece cada byte. La siguiente dependencia es Script: los campos de transacción identifican qué se gasta, mientras los scripts deciden si el gasto está autorizado.

Antes de avanzar, prueba tres cosas: parseo de varints en cada frontera, orden de bytes del txid y cálculo de comisión usando salidas previas. Si eso está correcto, los siguientes capítulos de transacciones tienen una base firme.

