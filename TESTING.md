# Loss Calc Testing & Validation Strategy

This document details the testing methodology, calculation test cases, and quality assurance processes for Loss Calc.

---

## 1. Calculation Engine Unit Testing

The fluid mechanics calculation engine in `src/core/calc/` is verified via automated Vitest unit tests against theoretical benchmark values, JSME published standards, and engineering handbook calculation samples.

### Test Cases
- Straight pipe friction head loss calculations (Darcy-Weisbach / Hazen-Williams)
- Minor loss calculations for elbows, tees, and valves
- Total head, water power, and shaft power at duty point

## 2. UI & Report Output Validation

- 3D piping canvas component rendering checks
- Report layout preview & browser print layout verification for formatted pump specification sheets

---

## 3. Automated Error & Quality Checks

TypeScript type checking, static analysis, and code formatting are verified via the following commands:

- **Type Check**: `npx tsc --noEmit` (verifies TypeScript types without emitting JavaScript, equivalent to `cargo check`)
- **Lint & Static Analysis**: `npx eslint .` (enforces strict typing and coding standards, equivalent to `cargo clippy`)
- **Pre-commit Automated Verification**: Automatically executed via `.git/hooks/pre-commit` before every git commit.




