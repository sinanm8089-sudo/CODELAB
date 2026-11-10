# CODELAB IDE — Desktop Application

**Developer:** Sinan Mohammed  
**Version:** 2.0  
**Framework:** Electron Native Host with Apple-inspired Liquid Glass Window Frame  
**Platforms:** Windows, macOS, Linux  

---

## 1. Overview

The `apps/desktop` package wraps CODELAB IDE in a cross-platform desktop shell providing:
- Native desktop window with Apple-inspired Liquid Glass framing.
- Local compiler toolchain detection (Python, Node.js, GCC, G++, Java, Git, Docker).
- Native directory open dialog for local workspace editing.
- Low-latency local file access and local subprocess runner bridge.

## 2. Requirements

- Node.js v18+ (tested with v24.1.0 on Windows)
- npm or yarn

## 3. Running Locally in Desktop Mode

```bash
cd apps/desktop
npm install
npm start
```

By default, the Electron window connects to `http://localhost:3000`. You can override the target URL using the `CODELAB_APP_URL` environment variable:

```bash
CODELAB_APP_URL="http://localhost:3000" npm start
```

## 4. Packaging and Distributing

### Windows (EXE Installer & Portable)
```bash
npm run dist:win
```
Outputs installer to `apps/desktop/dist/CODELAB IDE Setup 2.0.0.exe`.

### macOS (DMG & ZIP)
```bash
npm run dist:mac
```

### Linux (AppImage & DEB)
```bash
npm run dist:linux
```

