<!-- order: 1 -->

## Chapter Map

This chapter builds a fundamental mathematical piece that Bitcoin needs before talking about keys, signatures, and elliptic curves: **finite fields**.

The central idea is simple: instead of working with all possible real numbers (which are infinite and suffer from floating-point imprecision), we work with a limited set of elements and define special mathematical operations that guarantee the result always stays within that same set.

By the end of this chapter, you will be able to:
*   Explain what a finite field $F_p$ is.
*   Use modular arithmetic to keep results between $0$ and $p-1$.
*   Add, subtract, multiply, raise to powers, and divide within a finite field.
*   Understand and demonstrate why the field order must be a prime number in cryptography.
*   Implement the complete `FieldElement` class in Python.
*   See how this structure is the foundation for elliptic curve cryptography.

---
