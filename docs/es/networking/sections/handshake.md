<!-- order: 4 -->

## Handshake de red

Antes de intercambiar bloques o transacciones, dos nodos completan un **handshake**:

1. El iniciador envía `version` con: versión de protocolo, servicios, timestamp, direcciones, nonce de conexión, altura de la cadena del usuario (`start_height`), etc.
2. El receptor responde con su propio `version`.
3. Ambos envían `verack` para confirmar que aceptan la conexión.

Solo después del `verack` se considera la conexión establecida y se pueden enviar `inv`, `getdata`, `tx`, etc.

```python-sandbox
class SimplePeer:
    def __init__(self):
        self.connected = False

    def on_version(self):
        self.connected = True
        return "verack"

peer = SimplePeer()
print(peer.on_version())
print("Conectado?", peer.connected)
```

El campo `services` indica capacidades del nodo (por ejemplo, si anuncia ser nodo completo con `NODE_NETWORK`). El `nonce` evita que un nodo se conecte a sí mismo a través de NAT.

> [!TIP]
> Si las versiones de protocolo son incompatibles, el peer puede cerrar la conexión tras recibir `version`. Por eso los clientes modernos negocian versiones mínimas soportadas.

## Complemento de sección

El handshake establece que ambos peers hablan versiones compatibles del protocolo y están listos para intercambiar más mensajes. Un peer envía version, recibe version, envía verack y espera verack. Solo después de ese intercambio deben considerarse activas peticiones como getheaders o getdata.

El nonce en version ayuda a detectar conexiones accidentales a uno mismo. Services anuncia capacidades, pero no garantiza que cada petición será atendida. Clientes robustos deben manejar desconexiones, respuestas ausentes y peers con flags de servicio distintos.

