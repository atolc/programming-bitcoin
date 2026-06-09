<!-- order: 6 -->

## Groups and Public Keys

The points of an elliptic curve over $F_p$ form an **abelian group**:

- Closure under addition.
- Neutral element $\mathcal{O}$.
- Additive inverse $-P = (x, -y \bmod p)$.
- Associativity and commutativity.

In public-key cryptography:

- **Private key**: a secret integer $e$.
- **Public key**: $P = eG$, where $G$ is the generator point.

```python-sandbox
# Illustration with small integers (do not use in production)
priv = 201
# pub = priv * G  (scalar multiplication on the curve)
print(f"Private key: {priv}")
print("Public key: priv * G (point on the curve)")
```

Security depends on nobody being able to recover $e$ from $eG$.

### Public-Key Workflow

The cryptographic flow in the chapter is:

1. Choose a private key $e$.
2. Compute the public key $P = eG$.
3. Publish $P$, keep $e$ secret.
4. Sign a message hash $z$ with $e$.
5. Verify the signature with $P$.

The hard problem is not multiplying $G$ by $e$; that is fast. The hard problem is starting with $P$ and discovering which $e$ produced it.

```python-sandbox
def toy_scalar_mult(k, g, order):
    return (k * g) % order

order = 223
generator = 47
private_key = 91
public_key = toy_scalar_mult(private_key, generator, order)
print("toy public key:", public_key)
```
