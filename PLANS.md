# Loss Calc Project Master Plan

This document outlines the long-term architectural phases and short-term Atomic Work Units (AWU) for Loss Calc.

---

## Long-Term Roadmap

- **Phase 1: Core Type Definitions & Fluid Mechanics Calculation Engine**
  Establish core TypeScript interfaces, fluid property databases, Darcy-Weisbach / Hazen-Williams friction algorithms, fitting minor loss logic, and pump total head calculation engines with full Vitest test coverage.
- **Phase 2: React State Management & UI Parameter Input Forms**
  Build Zustand state store and responsive input forms for fluid selection, pipe line configuration, fitting additions, and pump operating condition inputs.
- **Phase 3: 3D Isometric Piping Viewer**
  Implement 3D canvas using Three.js and React Three Fiber to display interactive 3D piping skeletons with real-time parameter synchronization.
- **Phase 4: Printable Pump Specification Sheet & PDF Export**
  Construct print-optimized calculation report views supporting browser printing (`@media print`) and PDF export.

---

## Short-Term Plan: Atomic Work Units (AWU)

### AWU-001: Core Type Definitions
- **Objective**: Create `src/core/types/` defining interfaces for Fluid, PipeLine, Fitting, PumpSpec, and CalculationResult.
- **Verification**: `npx tsc --noEmit` passes without errors.

### AWU-002: Fluid & Piping Physical Constants
- **Objective**: Create `src/core/constants/` containing fluid property tables (water density, viscosity) and JIS pipe dimensional data.
- **Verification**: `npx tsc --noEmit` passes without errors.

### AWU-003: Straight Pipe Friction Loss Engine
- **Objective**: Implement `src/core/calc/friction.ts` (Darcy-Weisbach & Hazen-Williams formulas) with JSDoc engineering references.
- **Verification**: Vitest unit tests in `src/core/calc/__tests__/friction.test.ts` pass with 100% precision against JSME benchmarks.

### AWU-004: Fitting & Valve Minor Loss Engine
- **Objective**: Implement `src/core/calc/minor.ts` for elbow, tee, reducer, and valve loss calculations via equivalent lengths ($L_e$) and loss coefficients ($K$).
- **Verification**: Vitest unit tests in `src/core/calc/__tests__/minor.test.ts` pass.

### AWU-005: Pump Specification & Total Head Engine
- **Objective**: Implement `src/core/calc/pump.ts` calculating total head, water power, shaft power, and margin-adjusted requirements.
- **Verification**: Vitest unit tests in `src/core/calc/__tests__/pump.test.ts` pass.

### AWU-006: Zustand State Store Integration
- **Objective**: Create `src/store/useCalculatorStore.ts` unifying user inputs and reactive calculation results.
- **Verification**: State updates correctly re-trigger calculation engine without mutating state.

### AWU-007: Parameter Input UI Forms
- **Objective**: Build responsive React input forms in `src/components/calculator/` with unique element IDs (`id="..."`).
- **Verification**: Component type checks clean and inputs update Zustand store.

### AWU-008: 3D Piping Skeleton View Component
- **Objective**: Create R3F 3D piping canvas in `src/components/3d/` rendering pipe segments, elbows, and pumps.
- **Verification**: 3D viewport renders without console errors.

### AWU-009: Formatted Pump Spec Report View
- **Objective**: Create print-ready layout in `src/components/report/` for A4 output.
- **Verification**: Layout aligns properly under `@media print`.
