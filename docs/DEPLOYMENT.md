# CODELAB IDE — Production Deployment & Setup Guide

**Product:** CODELAB IDE v2.0  
**Architect & Developer:** Sinan Mohammed  

---

## 1. Local Development Setup (Windows)

### Prerequisites:
- Python 3.10+
- Node.js 18+ (tested with v24.1.0)

### Quick Run:
Execute the one-click launcher:
```cmd
RUN-WINDOWS.bat
```
or via PowerShell:
```powershell
.\RUN-WINDOWS.ps1
```

Access the platforms:
- **Frontend IDE:** [http://localhost:3000](http://localhost:3000)
- **FastAPI API:** [http://localhost:8000](http://localhost:8000)
- **API Swagger Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 2. Desktop Application Setup (Electron)

```bash
cd apps/desktop
npm install
npm start
```

Build native desktop binaries:
```bash
# Windows Installer (.exe & Portable)
npm run dist:win

# macOS DMG
npm run dist:mac

# Linux AppImage
npm run dist:linux
```

---

## 3. Docker Multi-Container Production Stack

```bash
# 1. Prepare environment configuration
cp .env.example .env

# 2. Build and run containers
docker compose up --build -d

# 3. Check health status
docker compose ps
```

The stack exposes:
- **Web Frontend:** Port 3000
- **API Backend:** Port 8000
- **PostgreSQL Database:** Port 5432
- **Redis Cache:** Port 6379

---

## 4. Environment Variables Configuration

Create a `.env` file in the project root:
```env
# Application Environment
ENVIRONMENT=production
SECRET_KEY=generate_a_secure_jwt_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# Database Configuration (PostgreSQL for Prod, SQLite for Dev)
DATABASE_URL=postgresql://codeverse_admin:codeverse_secure_pass_2026@localhost:5432/codeverse_prod
# Dev fallback:
# DATABASE_URL=sqlite:///./codeverse.db

# Google Gemini API
GEMINI_API_KEY="your_gemini_api_key_here"

# Frontend Public API Target
NEXT_PUBLIC_API_URL=http://localhost:8000
```
