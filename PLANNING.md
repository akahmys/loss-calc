# Loss Calc Planning & Discovery Protocol

This document governs task planning, feature design, calculation validation, and decision-making workflows within the Loss Calc project.

---

## 1. Planning Workflow

Before introducing major features, significant UI changes, or expanding the calculation engine (e.g., adding fitting libraries or advanced loss equations), create an actionable implementation plan.

---

## 2. Codebase Discovery Protocol

1. **Specification First**: Piping standards (JIS / ISO), pressure loss equations, and fitting equivalent length tables are defined as clear constants (`src/core/constants/`).
2. **Type-Driven Development**: Define and finalize TypeScript interfaces in `src/core/types/` before implementing calculation logic.


