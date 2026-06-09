<!-- order: 1 -->

## Mapa del capítulo

Crear una transacción no es solo rellenar campos: hay que serializar el formato de firma, aplicar `SIGHASH`, construir el `script_sig` y comprobar que los nodos la aceptarán.

Al terminar este capítulo podrás:

- Validar transacciones P2PKH paso a paso.
- Crear una transacción que gaste un UTXO y pague a una nueva dirección.
- Entender el flag `SIGHASH_ALL` y sus variantes.
- Enviar y confirmar transacciones en testnet.

En el siguiente capítulo generalizaremos los scripts con **Pay-to-Script-Hash** (P2SH).

## Notas de cobertura completa

### Flujo de validación
Un nodo comprueba que cada salida referenciada exista y no esté gastada, que los valores de entrada sean al menos los valores de salida, que ningún monto sea negativo o superior al límite monetario y que el script de cada entrada tenga éxito. Este capítulo une parseo de transacciones, evaluación de Script y verificación de firmas.

### Spentness y datos confiables
Para validar una transacción, el código debe obtener la transacción previa de cada entrada y localizar la salida referenciada. Esa salida aporta tanto el monto como el script_pubkey. Usar una API externa es cómodo para ejercicios, pero un nodo completo reduce confianza manteniendo su propio conjunto UTXO.

### Construcción del hash de firma
En P2PKH heredado, cada entrada se firma por separado. La serialización para firmar reemplaza el script_sig de la entrada actual con el script_pubkey de la salida previa, vacía los scripts de las demás entradas, añade el tipo SIGHASH y aplica doble SHA256. El entero resultante z es lo que ECDSA firma y verifica.

### Crear una transacción
El flujo práctico es elegir UTXO, elegir salida del destinatario, crear cambio si hace falta, estimar comisión, construir una transacción sin firmar, calcular z para cada entrada, producir firmas DER con SIGHASH_ALL, agregar llaves públicas SEC y serializar. El cambio debe ir a una dirección nueva, no a una dirección reutilizada.

### Trabajo en testnet
Testnet permite practicar sin fondos reales. Una implementación completa puede crear una llave privada testnet, derivar una dirección, recibir monedas de faucet, construir un gasto, firmarlo, serializarlo, transmitirlo e inspeccionar la confirmación. Los errores comunes son orden de bytes incorrecto, script equivocado para el digest, byte SIGHASH ausente o mala estimación de comisión.

