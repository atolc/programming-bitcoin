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
