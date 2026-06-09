<!-- order: 4 -->

## Firmas DER

Las firmas ECDSA son un par $(r, s)$ de enteros. En la red Bitcoin se codifican con **DER** (*Distinguished Encoding Rules*), un subconjunto de ASN.1.

La estructura es:

```
30 [longitud total]
   02 [longitud r] [r en big-endian, sin ceros a la izquierda innecesarios]
   02 [longitud s] [s en big-endian, sin ceros a la izquierda innecesarios]
```

Reglas importantes:

- Cada entero va precedido del byte `0x02` (tipo INTEGER en DER).
- Si el primer byte del entero tiene el bit alto activado ($\geq 0x80$), se antepone `0x00` para que no se interprete como negativo.
- Los ceros iniciales redundantes se eliminan, excepto el `0x00` de signo.

```python-sandbox
def encode_int(n):
    raw = n.to_bytes((n.bit_length() + 7) // 8, "big")
    if raw[0] & 0x80:
        raw = b"\x00" + raw
    return b"\x02" + bytes([len(raw)]) + raw

r, s = 0x7c4d7d0e, 0x9b5a7c0d
der = b"\x30" + bytes([len(encode_int(r) + encode_int(s))]) + encode_int(r) + encode_int(s)
print("DER:", der.hex())
```

> [!TIP]
> Una firma DER válida para Bitcoin debe tener entre 8 y 73 bytes. Firmas con $s$ en la mitad superior del orden de la curva se consideran inválidas desde BIP 62 (normalización *low-S*).

### Parsear DER

Parsear DER significa revisar cada byte marcador, leer longitudes y convertir los bytes de enteros de vuelta a enteros de Python.

```python-sandbox
def encode_int(n):
    raw = n.to_bytes((n.bit_length() + 7) // 8, "big") or b"\x00"
    raw = raw.lstrip(b"\x00") or b"\x00"
    if raw[0] & 0x80:
        raw = b"\x00" + raw
    return b"\x02" + bytes([len(raw)]) + raw

def der_encode(r, s):
    body = encode_int(r) + encode_int(s)
    return b"\x30" + bytes([len(body)]) + body

def der_parse(sig):
    if sig[0] != 0x30:
        raise ValueError("marcador compuesto inválido")
    r_marker = sig[2]
    if r_marker != 0x02:
        raise ValueError("marcador r inválido")
    r_len = sig[3]
    r = int.from_bytes(sig[4:4 + r_len], "big")
    s_index = 4 + r_len
    if sig[s_index] != 0x02:
        raise ValueError("marcador s inválido")
    s_len = sig[s_index + 1]
    s = int.from_bytes(sig[s_index + 2:s_index + 2 + s_len], "big")
    return r, s

encoded = der_encode(123456789, 987654321)
print(encoded.hex())
print(der_parse(encoded))
```
