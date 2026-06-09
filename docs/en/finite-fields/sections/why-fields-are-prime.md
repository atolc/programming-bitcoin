<!-- order: 7 -->

## Why the Order Must Be a Prime Number

The reason finite fields used by Bitcoin (such as the field of the `secp256k1` curve) have a prime order $p$ is of utmost importance. **If the field order is prime, every element except zero has a multiplicative inverse.** This is what makes division possible and unique.

If we take a nonzero element $k$ from our field $F_p$ (with $p$ prime) and multiply each element of the field by $k$:
$$\{k \cdot 0, k \cdot 1, k \cdot 2, \dots, k \cdot (p-1)\} \pmod p$$
The result of this set will be exactly the original set $\{0, 1, 2, \dots, p-1\}$ rearranged. No element is lost.

### What happens if the field order is composite?
Take modulus 12 (composite). If we multiply all numbers by 3, we get:
$$
\begin{aligned}
3 \cdot 0 \pmod{12} &= 0 \\
3 \cdot 1 \pmod{12} &= 3 \\
3 \cdot 2 \pmod{12} &= 6 \\
3 \cdot 3 \pmod{12} &= 9 \\
3 \cdot 4 \pmod{12} &= 0 \quad (\text{0 repeats and collapses!})
\end{aligned}
$$
The resulting set under multiplication by 3 is $\{0, 3, 6, 9\}$, which is an incomplete subset. This breaks the mathematical symmetry and makes it impossible to define a unique multiplicative inverse for 3.

---
