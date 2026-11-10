# CODELAB IDE — Universal Multi-Language IDE & DSA Learning Platform

**Developer & Architect:** Sinan Mohammed  
**Product Owner:** Sinan Mohammed  
**Version:** 2.0.0 Production  
**AI Environment:** Google Gemini 3.8 Flash (Multi-Tier Fallback Adapter)  
**Platforms:** Web Application + Native Desktop (Windows, macOS, Linux) + Mobile Responsive Browser  
**Design System:** Apple-inspired Liquid Glass (Dark Glass, Light Glass, OLED Black)  

---

## 1. Product Vision: Learn. Practise. Build.

CODELAB IDE is a universal multi-language developer ecosystem combining:
1. **Professional Multi-Language IDE:** Monaco Editor with multi-file management, syntax highlighting, diagnostics, project saving, export/import JSON, and live sandboxed web browser preview.
2. **Interactive Data Structures & Algorithms Lab:** Real step-by-step state tracing for 12 algorithms (Bubble, Selection, Insertion, Merge, Quick, Heap, Shell, Counting, Radix Sort, Linear & Binary Search, BFS/DFS) with side-by-side benchmarking and 10 interactive memory structures (Array, Linked List, Stack, Queue, Deque, Hash Table with chaining, BST, Binary Max-Heap, Prefix Trie, Disjoint Set Union).
3. **Coding Practice & Examination Platform:** Technical challenges across 11 computer science categories with standard I/O test runner, sample and hidden edge-case testing, scoring rubrics, and algorithm editorials.
4. **Interactive Visual Debugger:** Built with native `sys.settrace` execution tracing, stepping through variables, call stack frames, and runtime mutations without fake simulation.
5. **Conversational AI Teacher:** Powered by Google Gemini 3.8 Flash with 7 pedagogical modes (Simple, Detailed, Real-World Analogy, Visual Model, Code Demo, Exam Prep, Interactive Q&A) in English and Malayalam.
6. **Focus & Ambient Productivity Studio:** Pomodoro work-break timer with synchronized procedural Web Audio soundscapes (Rain, Pink Noise, Lofi Chord Synth, Alpha Binaural Beats).
7. **Apple Liquid Glass Personalization Studio:** Real-time translucency blur, background wallpapers, accent palette, theme toggles, and layout customization with database persistence.
8. **Cross-Platform Native Desktop Application:** Electron host in `apps/desktop` with local toolchain detection, native directory dialogs, and low-latency file operations.

---

## 2. Quick Start on Windows

### One-Click Launch (Batch Script):
Simply double-click or run:
```cmd
RUN-WINDOWS.bat
```

### PowerShell Launch:
```powershell
.\RUN-WINDOWS.ps1
```

This concurrently launches:
- **Frontend Web Application:** [http://localhost:3000](http://localhost:3000)
- **FastAPI Backend Server:** [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 3. Desktop Application Build (Electron)

```bash
cd apps/desktop
npm install
npm start
```
To generate native Windows installers:
```bash
npm run dist:win
```

---

## 4. Docker & Production Infrastructure

Deploy the multi-container stack with PostgreSQL, Redis, and isolated execution workers:
```bash
# 1. Environment configuration
cp .env.example .env

# 2. Build and launch services
docker compose up --build -d

# 3. Inspect health checks
docker compose ps
```

---

## 5. Automated Test Verification

Run the comprehensive pytest suite:
```powershell
$env:PYTHONPATH="."
.\apps\api\.venv\Scripts\pytest.exe apps\api\tests\test_api.py -v
```

All 8 automated test suites verify:
- Health check & developer attribution (**Sinan Mohammed**)
- User registration & student identity minting (`STU-YYYY-XXXXX`)
- Python runtime execution with timeout & memory quotas
- Compiler syntax error diagnostics parsing
- Visual debugger execution tracer (`sys.settrace`)
- Academy curriculum lessons & quiz completion
- Practice challenge evaluation against sample & hidden test cases
- Progress telemetry & performance analytics

---

## 6. Developer Attribution & Copyright

- **Architect & Product Owner:** Sinan Mohammed
- **Copyright:** © 2026 CODELAB IDE. All rights reserved.
