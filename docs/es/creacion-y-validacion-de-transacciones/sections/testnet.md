<!-- order: 4 -->

## Testnet

**Testnet** es una red paralela a mainnet con las mismas reglas de consenso pero moneda sin valor real. Sirve para practicar sin riesgo.

| Aspecto | Mainnet | Testnet |
|---------|---------|---------|
| Prefijo P2PKH Base58 | `1` (`0x00`) | `m` o `n` (`0x6f`) |
| Moneda | BTC real | tBTC (sin valor) |
| Dificultad | Alta | Baja |
| Faucets | No aplica | Disponibles en línea |

Flujo típico de práctica:

1. Generar par de llaves en testnet.
2. Solicitar tBTC en un faucet.
3. Crear y firmar una transacción que gaste el UTXO recibido.
4. Transmitir con `sendrawtransaction` a un nodo testnet.
5. Esperar confirmaciones en un explorador de testnet.

```python-sandbox
NETWORKS = {
    "mainnet": {"p2pkh_prefix": 0x00, "wif_prefix": 0x80},
    "testnet": {"p2pkh_prefix": 0x6f, "wif_prefix": 0xef},
}
for name, cfg in NETWORKS.items():
    print(f"{name}: P2PKH prefix 0x{cfg['p2pkh_prefix']:02x}")
```

> [!TIP]
> Nunca reutilices llaves entre mainnet y testnet. Usa bibliotecas que acepten un parámetro de red explícito para evitar firmar en la cadena equivocada.

## Complemento de sección

Testnet es donde el flujo de transacción se vuelve observable. Puedes derivar una dirección testnet, fondearla, obtener la transacción de fondeo, construir un gasto, firmarlo, transmitirlo y comparar tus bytes serializados con lo que reporta un nodo o explorador. Es la forma más rápida de encontrar errores de orden de bytes y scripts.

Trata testnet también como práctica de higiene operativa. Mantén llaves privadas separadas de mainnet, verifica prefijos de red y espera que faucets o peers fallen. Una transacción que funciona en testnet necesita la misma corrección de consenso que una en mainnet.

