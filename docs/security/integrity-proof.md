# Hash Chain Integrity Proof (Lite)

## Model
For ordered events `E_1 ... E_n`:
- `H_0 = GENESIS`
- `H_i = SHA256(Canonical(E_i) || H_{i-1})`

Stored tuple per event: `(E_i, H_{i-1}, H_i)`.

## Properties
1. **Mutation detection**: if any `E_i` changes, `Canonical(E_i)` changes, so `H_i` changes and all following links mismatch.
2. **Reordering detection**: swapping `E_i` and `E_j` changes predecessor relation, breaking `H_{k-1}` references.
3. **Removal detection**: removing `E_i` makes `H_{i+1}` reference a non-matching predecessor.

## Adversarial Cases
- **Payload tamper**: detected by recomputing `H_i`.
- **Backfill insertion**: detected by predecessor mismatch in verification traversal.
- **Silent deletion**: detected by chain discontinuity.

## Conclusion
Given preimage resistance of SHA-256 and deterministic canonicalization, tampering, reordering, or deletion is computationally infeasible to hide without chain break evidence.
