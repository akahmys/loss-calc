# Loss Calc: Web-Based Pump & Piping Pressure Loss Calculation App

**Loss Calc** is a web-based application for piping pressure loss calculation and pump specification sheet generation.

---

## Project Overview & Documentation

Development guidelines and system rules are managed across the following documents:

- **[AGENTS.md](AGENTS.md)**: Governance & Core Operating Principles
- **[ARCHITECTURE.md](ARCHITECTURE.md)**: System Design & Module Structure
- **[PLANNING.md](PLANNING.md)**: Planning & Task Workflows
- **[CODING.md](CODING.md)**: Coding Standards & Typing Guidelines
- **[AUDITING.md](AUDITING.md)**: Security & License Compliance
- **[TESTING.md](TESTING.md)**: Testing Strategy & Verification Procedures

---

## Key Capabilities

- **3D Piping Skeleton View**: Intuitive 3D isometric piping preview and editing via Three.js / React Three Fiber.
- **Pressure Loss Calculation**: Friction head loss and minor fitting/valve loss calculations based on Darcy-Weisbach / Hazen-Williams equations.
- **Pump Specification Calculation**: Automatic computation of total head, flow rate, and shaft power considering static head, piping losses, and safety margins.
- **Report Preview & Export**: Formatted preview, browser printing, and PDF export for pump specification sheets.

---

## Development Commands

```bash
# Start development server
npm run dev

# Type check & production build
npm run build

# Local preview
npm run preview
```

---

## License

- **MIT License**


