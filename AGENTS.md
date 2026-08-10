# Loss Calc Agentic Governance & System Architecture

Welcome to **Loss Calc**, a web-based pump spec sheet & piping pressure loss calculation application built with React, TypeScript, Vite, and Three.js.

---

## Governance Architecture & Document Structure

Project quality standards, architecture rules, and operational protocols are managed via the following modular documents:

| Document | Focus & Scope | Description |
| :--- | :--- | :--- |
| **[AGENTS.md](AGENTS.md)** | **Governance & Principles** | System vision, core rules, operating principles. |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | **System Architecture** | Directory structure, 3D viewer & calculation engine separation, state flow. |
| **[PLANNING.md](PLANNING.md)** | **Planning & Discovery** | Implementation plans, discovery protocols, task workflows. |
| **[CODING.md](CODING.md)** | **Coding Standards** | TypeScript typing rules, fluid calculation unit precision rules, component design. |
| **[AUDITING.md](AUDITING.md)** | **Security & Compliance** | Dependency auditing, license compliance, secret scanning. |
| **[TESTING.md](TESTING.md)** | **Testing & Validation** | Calculation engine unit tests, UI layout verification protocols. |

---

## Core Operating Principles

1. **Strict Calculation Precision**: Enforce exact fluid dynamics calculations (Darcy-Weisbach / Hazen-Williams formulas) and proper unit conversions.
2. **Unidirectional Data Flow**: Changes in the 3D piping model pass through the state management layer to update the calculation engine, maintaining consistency between visual representation and calculated results.
3. **Responsive & Print-Ready Design**: Ensure excellent in-browser usability as well as beautiful A4 layout for printed or exported calculation reports.
4. **Language Policy**: All source code, commit messages, comments, and project documentation (Markdown) must be written in **English**. Dialogues and discussions with the user are conducted in **Japanese**.




