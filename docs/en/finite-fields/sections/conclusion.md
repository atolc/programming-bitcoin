<!-- order: 12 -->

## Conclusion

Finite fields transform mathematical operations into closed, discrete, and deterministic number systems. This perfect wrap-around is what allows Bitcoin to use extremely complex cryptography with 256-bit numbers without precision errors or incompatibilities across operating systems.

In **Elliptic Curves**, we will study elliptic curves. In **Elliptic Curve Cryptography**, we will bring both pieces together to bring elliptic curve cryptography to life: curves defined over coordinates that live inside a finite field $F_p$.

:::details
Quick reference table of operations in F_p

| Operation | Definition |
|-----------|------------|
| Addition | $(a + b) \bmod p$ |
| Subtraction | $(a - b) \bmod p$ |
| Multiplication | $(a \cdot b) \bmod p$ |
| Division | $a \cdot b^{p-2} \bmod p$ |
| Power | $a^k \bmod p$ |
| Inverse | $a^{p-2} \bmod p$ |
:::

```quiz
[
  {
    "prompt": "In F19, what is the result of 11 + 17?",
    "options": ["28", "9", "17", "0"],
    "answer": 1,
    "explanation": "First you add as integers and then apply modulo: 28 % 19 = 9."
  },
  {
    "prompt": "Why is a prime modulus used for these fields?",
    "options": [
      "Because it guarantees multiplicative inverses for every nonzero element.",
      "Because it makes all operations faster than normal addition.",
      "Because it prevents negative elements from existing.",
      "Because Bitcoin only accepts numbers less than 19."
    ],
    "answer": 0,
    "explanation": "In a prime-order field, every element other than zero has a multiplicative inverse."
  },
  {
    "prompt": "What does dividing a / b mean within a finite field?",
    "options": [
      "Calculate a decimal and round it.",
      "Subtract b repeatedly until you reach a.",
      "Multiply a by the multiplicative inverse of b.",
      "Use Python integer division."
    ],
    "answer": 2,
    "explanation": "Division is defined as a * b^(-1), as long as b is not zero."
  },
  {
    "prompt": "According to Fermat's little theorem, if p is prime and n is nonzero, what is n^(p-1) % p?",
    "options": ["0", "1", "p - 1", "n"],
    "answer": 1,
    "explanation": "That result makes it possible to compute inverses with n^(p-2) within Fp."
  },
  {
    "prompt": "In the FieldElement class, what must be validated before adding two elements?",
    "options": [
      "That they have the same prime.",
      "That both numbers are even.",
      "That the result does not use modulo.",
      "That the exponent is positive."
    ],
    "answer": 0,
    "explanation": "Adding elements from different fields has no meaning within this abstraction."
  }
]
```
