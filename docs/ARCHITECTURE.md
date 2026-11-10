# CODELAB IDE — System Architecture & Engineering Specification

**Product:** CODELAB IDE v2.0  
**Architect & Developer:** Sinan Mohammed  

---

## 1. High-Level Architecture Overview

CODELAB IDE is structured as a modular full-stack application and desktop packaging system:

```
CODELAB IDE Architecture
├── Frontend (apps/web)
│   ├── Next.js 14 App Router (React 18 + TypeScript + Tailwind CSS)
│   ├── Monaco Code Editor Integration
│   ├── Apple Liquid Glass Design System
│   └── Web Audio Procedural Synthesizer
│
├── Backend API (apps/api)
│   ├── FastAPI 0.111+ High-Throughput REST Framework
│   ├── SQLAlchemy 2.0 ORM with SQLite (dev) & PostgreSQL (prod)
│   ├── Native Runner Subprocess Isolation
│   ├── Native Python Tracer (sys.settrace Visual Debugger)
│   └── Google Gemini 3.8 Flash AI Service Adapter
│
├── Desktop Application (apps/desktop)
│   ├── Electron Native Shell (Windows / macOS / Linux)
│   ├── Preload Bridge (Secure Context Isolation IPC)
│   └── Local Compiler Toolchain Discovery Engine
│
└── Infrastructure & Database (infrastructure/)
    ├── Multi-Stage Dockerfiles (API, Web, Isolated Runner)
    ├── Docker Compose Multi-Container Orchestration
    └── PostgreSQL Initialization Schema (init.sql)
```

---

## 2. Compiler & Secure Execution Pipeline

Code submitted to `/api/execution/run` is processed through the multi-tier execution adapter:
1. **Safety Inspection:** Temporary isolated directory creation with strict quotas.
2. **Execution Limits:** Process timeout enforcement (default 5.0 seconds), maximum stdout/stderr capture buffer (50 KB) to prevent memory exhaustion from infinite printing loops.
3. **Execution Workers:**
   - Python: Subprocess execution using host Python 3.10 virtual environment.
   - Node.js / JavaScript: Subprocess execution using host Node.js v24.
   - SQL: Memory-sandboxed SQLite database with preloaded academic schema.
   - C / C++ / Java / Bash / PowerShell: Host toolchain execution with fallback diagnostic error reporting.
4. **Error Diagnostics Parser:** Captures exit codes and parses traceback exceptions, syntax errors, and missing symbols, passing structured context to the AI Diagnostic Engine.

---

## 3. Data Model & Storage

1. **User Identity:** Unique auto-minted Student ID (`STU-YYYY-XXXXX`), password bcrypt hashing, role authorization.
2. **Curriculum:** 25 progressive programming lessons, quizzes, and completion trackers.
3. **Practice Problems:** Algorithmic challenges with sample test cases and hidden test cases.
4. **User Preferences:** Theme (`dark-glass`, `light-glass`, `oled-black`), wallpaper, blur, accent color, audio preset.
5. **Telemetry:** Execution counts, streak tracker, study minutes, language breakdown.

---

## 4. Verification & Testing

- Automated tests execute via Pytest:
  ```powershell
  $env:PYTHONPATH="."
  .\apps\api\.venv\Scripts\pytest.exe apps\api\tests\test_api.py -v
  ```
- Frontend production build verification:
  ```bash
  npm --prefix apps/web run build
  ```
