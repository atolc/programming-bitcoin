<!-- order: 2 -->

## Lo mas importante

- Validar una transaccion implica verificar que sus inputs existen, no han sido gastados, cubren los outputs y tienen firmas correctas.
- La suma de outputs no puede exceder la suma de inputs.
- La comision debe ser no negativa y queda para el minero.
- Para firmar un input, se construye un mensaje especial: una version modificada de la transaccion con el script previo correspondiente.
- Cada input se firma individualmente.
- `SIGHASH_ALL` firma todos los inputs y outputs bajo el modo mas comun.
- Una firma se coloca en el `scriptSig` junto con la llave publica cuando se gasta un p2pkh.
- Testnet permite practicar creacion y transmision de transacciones sin arriesgar fondos reales.
