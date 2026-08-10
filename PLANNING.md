# Loss Calc Planning & Discovery Protocol

This document governs task planning, feature design, calculation validation, and decision-making workflows within the Loss Calc project.

---

## 1. Planning & Milestone Management

1. **Master Plan (`PLANS.md`)**: Project tasks, long-term roadmap phases, and short-term execution plans must be maintained in `PLANS.md` at the project root.
2. **Atomic Work Units (AWU)**: Short-term plans must be broken down into Atomic Work Units (AWU)—small, single-responsibility tasks that can be independently built, tested, and committed.

---

## 2. Codebase Discovery Protocol

1. **Specification First**: Piping standards (JIS / ISO), pressure loss equations, and fitting equivalent length tables are defined as clear constants (`src/core/constants/`).
2. **Type-Driven Development**: Define and finalize TypeScript interfaces in `src/core/types/` before implementing calculation logic.



