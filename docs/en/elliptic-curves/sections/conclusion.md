<!-- order: 8 -->

## Conclusion

You have seen the definition of elliptic curves, the geometry of point addition, and a Python implementation over the reals.

The essentials:

- The equation $y^2 = x^3 + ax + b$ defines the set of valid points.
- Point addition forms an **abelian group** with neutral element $\mathcal{O}$.
- Doubling is a special case of addition when $P = Q$.

In **Elliptic Curve Cryptography** we will take these points to a finite field $F_p$, define secp256k1, and build public keys and ECDSA signatures.
