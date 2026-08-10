# Loss Calc Coding Standards & Guidelines

This document defines the coding conventions, TypeScript typing rules, fluid mechanics calculation accuracy requirements, and component design patterns for Loss Calc.

---

## 1. TypeScript & Code Safety Rules

1. **Strict Type Safety**: The `any` type is strictly forbidden. Use `unknown` or generics for unidentified types.
2. **Explicit Return Types**: Explicit return type annotations are required for core calculation functions, custom hooks, and public APIs.
3. **No Dynamic Swallowing**: When calculation errors or edge cases occur (such as division by zero, velocity = 0, or pipe diameter = 0), silent fallbacks are prohibited. Return explicit error states or warnings.
4. **Immutable Calculations**: Calculation functions must not mutate input objects; always return new calculation result objects.
5. **Function Line Limit**: A single function must not exceed **50 lines** (excluding comments and type definitions). Refactor long procedures into small, single-responsibility helper functions.
6. **File Line Limit**: A single source file must not exceed **300 lines**. Separate complex modules, types, and components into dedicated sub-files.
7. **Comment Quality (Why, Not What)**: Code comments must explain the **rationale, intent, or engineering reason (Why)** behind a decision, rather than describing what the code mechanically does (What).



---

## 2. Fluid Mechanics & Calculation Conventions (`src/core/calc/`)

- **SI Base Unit Normalization**: Internal calculation logic works exclusively in SI base units (\(m\), \(m^3/s\), \(Pa\), \(kg/m^3\)). Conversion helpers format values to/from user inputs (\(mm\), \(L/min\), \(kPa\)).
- **Calculation Formula Documentation**: Fluid calculation code must include JSDoc comments referencing standard fluid equations and engineering references.

---

## 3. UI & 3D Viewer Guidelines

- **React Three Fiber (R3F) Component Isolation**: 3D rendering elements (meshes, lights, controls) must be clean components separated from standard DOM UI.
- **Responsive & Print Layout**: Use CSS media queries (`@media print`) to seamlessly switch between the interactive browser view and A4 printable calculation report layouts.


