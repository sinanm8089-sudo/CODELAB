# CODELAB IDE — Master Product Requirements Document (PRD)

**Product:** CODELAB IDE  
**Version:** 2.0.0 Production  
**Developer & Architect:** Sinan Mohammed  
**Target AI Model:** Google Gemini 3.8 Flash  
**Platforms:** Web Application + Desktop Native + Mobile Browser  
**Design System:** Apple Liquid Glass (Dark Glass, Light Glass, OLED Black)  

---

## 1. Executive Summary

CODELAB IDE is a universal multi-language development and computer science learning platform engineered by **Sinan Mohammed**. It unites a high-performance Monaco web IDE, isolated multi-language compiler infrastructure, step-by-step DSA visualizers, practical examination evaluators, a conversational AI tutor, and an ambient focus environment into an integrated, zero-dependency product.

### Core Philosophy:
- **Learn. Practise. Build.**
- Understand before implementing.
- Visualize before assuming.
- Practice before examinations.
- Explain every compiler and runtime error instead of simply outputting error logs.

---

## 2. Product Modules

### 2.1 Multi-Language IDE
- Monaco Editor with multi-tab support, syntax highlighting, diagnostics, and project file tree.
- Built-in Git Inspector (branch management, commit logging, visual diffs).
- Direct language starter templates (Python, JavaScript, TypeScript, C, C++, Java, Go, Rust, SQL, Bash, HTML/CSS).
- Sandboxed live browser preview for HTML5 and CSS3.

### 2.2 Interactive DSA & Algorithm Visualizer
- 12 fully implemented step-by-step algorithms: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort, Shell Sort, Counting Sort, Radix Sort, Linear Search, Binary Search, BFS/DFS.
- Side-by-side comparison mode running identical inputs simultaneously with live comparison/swap counters.
- 10 interactive memory structures: Contiguous Array, Singly Linked List, LIFO Stack, FIFO Queue, Deque, Hash Table with chaining, Binary Search Tree, Binary Max-Heap, Retrieval Trie, and Disjoint Set Union (DSU).

### 2.3 Coding Practice & Practical Examination Lab
- Catalog of algorithmic challenges across 11 core computer science categories.
- Automatic verification against sample and hidden edge-case test cases.
- Time limit enforcement, memory consumption profiling, rubric score calculation, and optimal algorithm editorials.
- Timed examination mode with interactive countdown alerts.

### 2.4 Visual Execution Debugger
- Native step-by-step Python execution tracer powered by `sys.settrace`.
- Real-time variable memory inspector, call-stack frame stack, and line progression without mocked data.

### 2.5 AI Teaching Studio
- Powered by Google Gemini 3.8 Flash with 7 pedagogical modes: Simple Explanation, Detailed Deep Dive, Real-World Analogy, Visual Mental Model, Code Demonstration, Exam Prep, and Interactive Q&A.
- Multi-lingual capability in English and Malayalam.

### 2.6 Personalization Studio & Focus Environment
- Apple Liquid Glass design controls: glass blur, opacity sliders, wallpaper backgrounds, and accent palettes.
- Procedural Web Audio ambient generator: Gentle Rain, Pink Noise, Lofi Chord Drone, Alpha Binaural Beats (10 Hz).

### 2.7 Cross-Platform Desktop Architecture
- Electron desktop wrapper (`apps/desktop`) for Windows, macOS, and Linux with local toolchain discovery and native directory selection.

---

## 3. Product Attribution
- **Developer:** Sinan Mohammed
- **Copyright:** © 2026 CODELAB IDE. All rights reserved.
