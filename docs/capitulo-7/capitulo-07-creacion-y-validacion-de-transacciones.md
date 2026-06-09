# Capitulo 7: Creacion y validacion de transacciones

## Objetivo del capitulo

Pasar de leer transacciones a validarlas y construirlas. El capitulo muestra como verificar inputs, calcular firmas para una transaccion y crear una transaccion en testnet.

## Lo mas importante

- Validar una transaccion implica verificar que sus inputs existen, no han sido gastados, cubren los outputs y tienen firmas correctas.
- La suma de outputs no puede exceder la suma de inputs.
- La comision debe ser no negativa y queda para el minero.
- Para firmar un input, se construye un mensaje especial: una version modificada de la transaccion con el script previo correspondiente.
- Cada input se firma individualmente.
- `SIGHASH_ALL` firma todos los inputs y outputs bajo el modo mas comun.
- Una firma se coloca en el `scriptSig` junto con la llave publica cuando se gasta un p2pkh.
- Testnet permite practicar creacion y transmision de transacciones sin arriesgar fondos reales.

## Que hay que aprender

- Implementar verificacion completa de una transaccion.
- Obtener el `scriptPubKey` y el monto de la salida previa.
- Construir el hash de firma para un input.
- Firmar inputs con una llave privada.
- Crear outputs de pago y cambio.
- Entender por que una transaccion sin cambio entrega el sobrante como comision.
- Usar testnet como entorno seguro de aprendizaje.

## Ideas para estudiar

- Crear una transaccion simple p2pkh en testnet.
- Calcular manualmente input total, output total y comision.
- Firmar cada input y verificar la transaccion antes de transmitirla.
- Cambiar intencionalmente una firma o output para observar que la validacion falla.

## Resultado esperado

Al terminar, deberias poder construir una transaccion Bitcoin basica, firmarla correctamente y razonar sobre su validez.
