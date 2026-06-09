<!-- order: 6 -->

## Combining Fields

To **build** a script from commands, the inverse of parsing concatenates opcodes and data:

```python
def serialize_script(commands):
    result = b""
    for cmd in commands:
        if isinstance(cmd, int):
            result += bytes([cmd])
        elif isinstance(cmd, bytes):
            length = len(cmd)
            if length < 0x4c:
                result += bytes([length]) + cmd
            else:
                result += b"\x4c" + bytes([length]) + cmd
    return result
```

P2PKH example: lock funds to the address derived from a public key.

$$\text{script\_pubkey} = \texttt{OP\_DUP}\,\|\,\texttt{OP\_HASH160}\,\|\,\text{push}(H_{160}(\text{pubkey}))\,\|\,\texttt{OP\_EQUALVERIFY}\,\|\,\texttt{OP\_CHECKSIG}$$

```python-sandbox
def push(data):
    return bytes([len(data)]) + data

hash160 = bytes.fromhex("89abcdefabbaabbaabbaabbaabbaabbaabbaabba")
script = bytes([0x76, 0xa9]) + push(hash160) + bytes([0x88, 0xac])
print("P2PKH script:", script.hex())
print("Length:", len(script), "bytes")
```

> [!TIP]
> A typical P2PKH `script_sig` is `push(der_signature) push(sec_public_key)`. Both scripts are serialized separately and go in different fields of the transaction.

## Section Completion

Combining fields means taking two serialized script fields from different parts of the transaction model and evaluating them as one authorization program. The spender controls script_sig; the previous output controls script_pubkey. Validation succeeds only if their combination leaves a truthy result.

The crucial boundary is signing. For legacy signatures, the script used in the digest is not the script_sig from the transaction being signed; it is the previous output's script_pubkey for the input under consideration. This prevents the signature from signing itself.

