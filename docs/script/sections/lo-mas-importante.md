<!-- order: 2 -->

## Lo mas importante

- Script es un lenguaje simple basado en pila, usado para bloquear y desbloquear monedas.
- Una salida contiene condiciones de gasto; un input proporciona datos para satisfacerlas.
- La validacion combina `scriptSig` y `scriptPubKey`, ejecutando instrucciones sobre una pila.
- Los opcodes manipulan datos, duplican elementos, calculan hashes y verifican firmas.
- p2pk paga directamente a una llave publica, pero expone esa llave desde el inicio.
- p2pkh paga a un hash de llave publica, lo que mejora privacidad y reduce exposicion temprana.
- En p2pkh, el gasto debe proporcionar firma y llave publica; el script verifica que la llave corresponde al hash y que la firma es valida.
- Script no es Turing completo: esta limitado para reducir riesgos de ejecucion infinita y complejidad.
- La expresividad de Script permite mas que pagos simples, aunque la red favorece patrones estandar.
